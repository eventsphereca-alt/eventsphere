const { readDb, writeDb } = require("./db");
const { queueEmailEvent } = require("./email");
const { readBackendEnv } = require("./env");
const { getSupabaseConfig, createSupabaseAdminClient, createSupabaseAuthClient, isSupabaseDataSchemaReady } = require("./supabase");
const {
  createSupabaseLeadForVendor,
  createSupabaseReview,
  createSupabaseReviewRequest,
  createSupabaseSupportRequest,
  fetchSupabaseAdminDashboard,
  fetchSupabaseArchiveData,
  fetchSupabaseBootstrapData,
  fetchSupabaseListingBySlug,
  fetchSupabaseVendorDashboard,
  readAppSettings,
  readVendorWorkspaceSettingsBySlug,
  updateSupabaseAdminRequest,
  updateSupabaseAdminVendor,
  updateSupabaseLeadForVendor,
  updateSupabaseReviewStatus,
  updateSupabaseVendorBySlug,
  writeAppSettings,
  writeVendorWorkspaceSettingsBySlug
} = require("./supabase-data");

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function nowIso() {
  return new Date().toISOString();
}

function createSessionFromUser(user) {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    vendorSlug: user.vendorSlug || null
  };
}

function createSessionPayload({ fullName, email, role, vendorSlug }) {
  return {
    name: fullName || email || "Event Sphere User",
    email: email || "",
    role: role === "admin" ? "admin" : "vendor",
    vendorSlug: vendorSlug || null
  };
}

function parseBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || "";
  const match = String(header).match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function buildSupabaseUserMetadata(user, vendor) {
  return {
    full_name: user.name,
    app_role: user.role,
    vendor_slug: user.vendorSlug || null,
    business_name: vendor?.businessName || null
  };
}

async function findSupabaseUserByEmail(supabaseAdmin, email) {
  if (!supabaseAdmin || !email) return null;

  let page = 1;
  while (page <= 10) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 200
    });
    if (error) throw error;
    const users = Array.isArray(data?.users) ? data.users : [];
    const match = users.find((entry) => String(entry.email || "").toLowerCase() === String(email).toLowerCase());
    if (match) return match;
    if (users.length < 200) break;
    page += 1;
  }

  return null;
}

async function ensureSupabaseAuthUser({ supabaseAdmin, user, password, vendor }) {
  if (!supabaseAdmin || !user?.email || !password) return null;

  const existingUser = await findSupabaseUserByEmail(supabaseAdmin, user.email);
  const userMetadata = buildSupabaseUserMetadata(user, vendor);

  if (existingUser) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...existingUser.user_metadata,
        ...userMetadata
      }
    });
    if (error) throw error;
    return data.user || existingUser;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: user.email,
    password,
    email_confirm: true,
    user_metadata: userMetadata
  });
  if (error) throw error;
  return data.user || null;
}

async function signInWithSupabasePassword({ email, password }) {
  const supabaseAuth = createSupabaseAuthClient();
  if (!supabaseAuth) return { session: null, user: null, error: null };

  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password
  });

  return {
    session: data?.session || null,
    user: data?.user || null,
    error: error || null
  };
}

async function resolveRequestIdentity(req) {
  if (Object.prototype.hasOwnProperty.call(req, "__eventsphereIdentity")) {
    return req.__eventsphereIdentity;
  }

  const token = parseBearerToken(req);
  if (!token) {
    req.__eventsphereIdentity = null;
    return null;
  }

  const supabaseAuth = createSupabaseAuthClient();
  if (!supabaseAuth) {
    req.__eventsphereIdentity = null;
    return null;
  }

  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data?.user) {
    req.__eventsphereIdentity = null;
    return null;
  }

  const session = await resolveSupabaseSessionForUser(data.user);
  const identity = {
    token,
    authUser: data.user,
    session
  };

  req.__eventsphereIdentity = identity;
  return identity;
}

async function requireAuthenticatedRequest(req, res) {
  const identity = await resolveRequestIdentity(req);
  if (!identity) {
    sendJson(res, 401, { error: "Authentication required" });
    return null;
  }
  return identity;
}

async function requireAdminRequest(req, res) {
  const identity = await requireAuthenticatedRequest(req, res);
  if (!identity) return null;
  if (identity.session.role !== "admin") {
    sendJson(res, 403, { error: "Admin access required" });
    return null;
  }
  return identity;
}

async function requireVendorAccess(req, res, slug) {
  const identity = await requireAuthenticatedRequest(req, res);
  if (!identity) return null;

  if (identity.session.role === "admin") {
    return identity;
  }

  if (identity.session.role === "vendor" && identity.session.vendorSlug === slug) {
    return identity;
  }

  const supabaseAdmin = createSupabaseAdminClient();
  if (supabaseAdmin && identity.authUser?.id) {
    const result = await supabaseAdmin
      .from("vendors")
      .select("id")
      .eq("slug", slug)
      .eq("owner_user_id", identity.authUser.id)
      .maybeSingle();
    if (result.error) throw result.error;
    if (result.data) {
      return identity;
    }
  }

  sendJson(res, 403, { error: "You do not have access to this vendor workspace" });
  return null;
}

async function resolveSupabaseSessionForUser(authUser) {
  const supabaseAdmin = createSupabaseAdminClient();
  if (!supabaseAdmin || !authUser?.id) {
    return createSessionPayload({
      fullName: authUser?.user_metadata?.full_name,
      email: authUser?.email,
      role: authUser?.user_metadata?.app_role || "vendor",
      vendorSlug: authUser?.user_metadata?.vendor_slug || null
    });
  }

  const [profileResult, vendorResult] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("id, role, full_name")
      .eq("id", authUser.id)
      .maybeSingle(),
    supabaseAdmin
      .from("vendors")
      .select("slug")
      .eq("owner_user_id", authUser.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
  ]);

  if (profileResult.error) throw profileResult.error;
  if (vendorResult.error) throw vendorResult.error;

  return createSessionPayload({
    fullName: profileResult.data?.full_name || authUser.user_metadata?.full_name,
    email: authUser.email,
    role: profileResult.data?.role || authUser.user_metadata?.app_role || "vendor",
    vendorSlug: vendorResult.data?.slug || authUser.user_metadata?.vendor_slug || null
  });
}

async function buildUniqueSupabaseVendorSlug(baseSlug) {
  const supabaseAdmin = createSupabaseAdminClient();
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const vendorResult = await supabaseAdmin.from("vendors").select("id").eq("slug", slug).maybeSingle();
    if (vendorResult.error) throw vendorResult.error;
    if (!vendorResult.data) return slug;
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

async function hasExistingSupabaseVendorApplication(supabaseAdmin, email) {
  if (!supabaseAdmin || !email) return false;

  const result = await supabaseAdmin
    .from("vendors")
    .select("id")
    .eq("contact_email", String(email).trim())
    .limit(1);

  if (result.error) throw result.error;
  return Boolean(result.data?.length);
}

async function createSupabaseVendorApplication(body) {
  const supabaseAdmin = createSupabaseAdminClient();
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client is not configured");
  }

  const existingUser = await findSupabaseUserByEmail(supabaseAdmin, body.email);
  if (existingUser) {
    return { error: "Email already exists", statusCode: 409 };
  }
  if (await hasExistingSupabaseVendorApplication(supabaseAdmin, body.email)) {
    return { error: "An application already exists for this email", statusCode: 409 };
  }

  const slugBase = slugify(body.businessName);
  const slug = await buildUniqueSupabaseVendorSlug(slugBase);
  const specialtyTags = Array.isArray(body.specialties)
    ? body.specialties.map((item) => String(item).trim()).filter(Boolean).filter((item) => item.toLowerCase() !== "all")
    : [];
  const normalizedPhone = body.phone ? String(body.phone).trim() : null;
  const normalizedWhatsapp = body.whatsapp ? String(body.whatsapp).trim() : null;
  const normalizedWebsite = body.website ? String(body.website).trim() : null;
  const normalizedInstagram = body.instagram ? String(body.instagram).trim() : null;
  const normalizedFacebook = body.facebook ? String(body.facebook).trim() : null;
  const normalizedDescription = String(body.description || "").trim() || null;

  const vendorResult = await supabaseAdmin
    .from("vendors")
    .insert({
      owner_user_id: null,
      slug,
      business_name: body.businessName,
      category: body.category || null,
      city: body.city || null,
      province: "Ontario",
      price_from: Number(body.priceFrom) || 0,
      years_in_business: body.yearsInBusiness ? String(body.yearsInBusiness).trim() : null,
      rating: 0,
      reviews_count: 0,
      verified: false,
      featured: false,
      status: "pending",
      review_status: "pending",
      image_url: null,
      gallery: [],
      description: normalizedDescription,
      long_description: normalizedDescription,
      tags: specialtyTags,
      languages: [],
      event_types: [],
      cultural_specialties: specialtyTags,
      service_areas: body.city ? [String(body.city).trim()] : [],
      contact_email: body.email,
      contact_phone: normalizedPhone,
      contact_whatsapp: normalizedWhatsapp,
      contact_website: normalizedWebsite,
      instagram: normalizedInstagram,
      facebook: normalizedFacebook,
      metrics: {}
    })
    .select("id, slug")
    .single();

  if (vendorResult.error) throw vendorResult.error;

  const env = readBackendEnv();
  let notificationStatus = "not_configured";
  if (env.adminAlertEmail) {
    try {
      await queueEmailEvent({
        eventType: "vendor_application_submitted_admin",
        targetEmail: env.adminAlertEmail,
        relatedTable: "vendors",
        relatedId: vendorResult.data.id,
        payload: {
          vendorName: body.businessName,
          applicantName: body.ownerName || body.name || "Not provided",
          category: body.category || "Not provided",
          city: body.city || "Not provided",
          email: body.email,
          submittedAt: new Date().toLocaleString("en-CA", {
            dateStyle: "medium",
            timeStyle: "short"
          })
        }
      });
      notificationStatus = "queued";
    } catch (error) {
      notificationStatus = "failed";
      console.error("Unable to send vendor application admin notification:", error.message);
    }
  }

  return {
    slug: vendorResult.data.slug,
    notificationStatus
  };
}

async function isVendorWorkspaceApproved({ role, vendorSlug, db, supabaseDataReady }) {
  if (role !== "vendor") return true;
  if (!vendorSlug) return false;

  if (supabaseDataReady) {
    const supabaseAdmin = createSupabaseAdminClient();
    if (!supabaseAdmin) return false;
    const result = await supabaseAdmin.from("vendors").select("status").eq("slug", vendorSlug).maybeSingle();
    if (result.error) throw result.error;
    return result.data?.status === "approved";
  }

  const vendor = db?.vendors?.find((entry) => entry.slug === vendorSlug);
  return vendor?.status === "approved";
}

function displayDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(typeof value === "string" ? new Date(value) : value);
}

function withCardFields(item) {
  return {
    id: item.id,
    slug: item.slug,
    type: item.type,
    businessName: item.businessName,
    category: item.category,
    city: item.city,
    province: item.province,
    priceFrom: item.priceFrom,
    rating: item.rating,
    reviews: item.reviews,
    verified: item.verified,
    featured: item.featured,
    status: item.status,
    image: item.image,
    description: item.description,
    tags: item.tags || [],
    capacity: item.capacity || null,
    reviewStatus: item.reviewStatus || item.status || "pending",
    rejectionReason: item.rejectionReason || ""
  };
}

function collectCities(db) {
  const items = [...db.vendors, ...db.venues].filter((item) => item.status === "approved");
  return [...new Set(items.map((item) => item.city))].sort();
}

function collectCategories(db) {
  const counts = new Map();
  for (const item of db.vendors.filter((vendor) => vendor.status === "approved")) {
    counts.set(item.category, (counts.get(item.category) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function searchListings(items, search) {
  if (!search) {
    return items;
  }
  const needle = search.toLowerCase();
  return items.filter((item) => {
    const haystack = [
      item.businessName,
      item.category,
      item.city,
      item.description,
      ...(item.tags || [])
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

function buildAvailability(item) {
  if (Array.isArray(item.availability?.dates) && item.availability.dates.length) {
    return item.availability.dates;
  }

  const today = new Date();
  const blackoutNeedles = Array.isArray(item.availability?.blackoutDates) ? item.availability.blackoutDates : [];
  const slotSets = item.type === "venue"
    ? [
        ["10:00 AM - 2:00 PM", "3:00 PM - 7:00 PM"],
        ["11:00 AM - 3:00 PM", "5:00 PM - 9:00 PM"],
        ["9:00 AM - 1:00 PM", "2:00 PM - 6:00 PM"],
        ["12:00 PM - 4:00 PM"],
        ["4:00 PM - 8:00 PM", "8:30 PM - 11:30 PM"]
      ]
    : [
        ["9:00 AM - 11:00 AM", "6:00 PM - 8:00 PM"],
        ["10:00 AM - 12:00 PM", "4:00 PM - 6:00 PM"],
        ["1:00 PM - 3:00 PM", "7:00 PM - 9:00 PM"],
        ["11:00 AM - 1:00 PM"],
        ["3:00 PM - 5:00 PM", "8:00 PM - 10:00 PM"]
      ];

  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index + 1);
    const dateLabel = new Intl.DateTimeFormat("en-CA", {
      weekday: "short",
      month: "short",
      day: "numeric"
    }).format(date);

    return {
      date: date.toISOString().slice(0, 10),
      label: dateLabel,
      status: blackoutNeedles.some((entry) => String(entry).includes(date.toISOString().slice(0, 10)) || String(entry).includes(dateLabel))
        ? "Booked"
        : index === 3 ? "Limited" : "Available",
      slots: slotSets[index % slotSets.length]
    };
  });
}

function normalizeStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }
  return String(value || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildAdminCounts(vendors) {
  return {
    pending: vendors.filter((item) => item.status === "pending").length,
    approved: vendors.filter((item) => item.status === "approved").length,
    rejected: vendors.filter((item) => item.status === "rejected").length,
    featured: vendors.filter((item) => item.featured).length
  };
}

function sortByDateRank(items) {
  return [...items].sort((a, b) => (a.dateRank || 999) - (b.dateRank || 999));
}

function getVendorBySlug(db, slug) {
  return db.vendors.find((item) => item.slug === slug);
}

function workspaceListingIdentity(item = {}) {
  return item.id || item.slug || item.businessName || "";
}

function sortListingsByFeaturedAndRating(items) {
  return [...items].sort((a, b) => {
    if (Number(b.featured) !== Number(a.featured)) {
      return Number(b.featured) - Number(a.featured);
    }
    return Number(b.rating || 0) - Number(a.rating || 0);
  });
}

function matchesListingFilters(item, { category = "", city = "", search = "" } = {}) {
  if (category && item.category !== category) return false;
  if (city && item.city !== city) return false;
  if (search) {
    const needle = String(search).toLowerCase();
    const haystack = [
      item.businessName,
      item.category,
      item.city,
      item.description,
      ...(item.tags || [])
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

function normalizeWorkspaceListingRecord(input = {}, ownerVendor = {}) {
  const businessName = String(input.businessName || ownerVendor.businessName || "").trim();
  const slug = String(input.slug || slugify(businessName)).trim();
  const gallerySeed = Array.isArray(input.gallery)
    ? input.gallery
    : Array.isArray(input.images)
      ? input.images
      : [];
  const gallery = gallerySeed.map((entry) => String(entry || "").trim()).filter(Boolean).slice(0, 6);
  const availabilitySource = input.availability && typeof input.availability === "object" ? input.availability : {};
  const culturalSpecialties = normalizeStringArray(input.culturalSpecialties || input.tags || ownerVendor.culturalSpecialties || ownerVendor.tags);

  return {
    id: String(input.id || `vendor-listing-${slug || Date.now()}`),
    slug,
    type: "vendor",
    ownerVendorSlug: String(ownerVendor.slug || input.ownerVendorSlug || slug).trim(),
    businessName,
    category: String(input.category || ownerVendor.category || "").trim(),
    city: String(input.city || ownerVendor.city || "").trim(),
    province: String(input.province || ownerVendor.province || "Ontario").trim(),
    priceFrom: Number(input.priceFrom) || 0,
    rating: Number(input.rating ?? ownerVendor.rating ?? 0),
    reviews: Number(input.reviews ?? ownerVendor.reviews ?? 0),
    verified: input.verified ?? ownerVendor.verified ?? false,
    featured: Boolean(input.featured),
    status: String(input.status || "approved").trim(),
    image: String(input.image || gallery[0] || ownerVendor.image || "").trim(),
    gallery,
    description: String(input.description || "").trim(),
    longDescription: String(input.longDescription || input.description || "").trim(),
    tags: culturalSpecialties,
    culturalSpecialties,
    languages: Array.isArray(input.languages) ? input.languages : ownerVendor.languages || [],
    eventTypes: Array.isArray(input.eventTypes) ? input.eventTypes : ownerVendor.eventTypes || [],
    servicePackages: Array.isArray(input.servicePackages) ? input.servicePackages : ownerVendor.servicePackages || [],
    contact: input.contact && typeof input.contact === "object"
      ? {
          email: String(input.contact.email || ownerVendor.contact?.email || "").trim(),
          phone: String(input.contact.phone || ownerVendor.contact?.phone || "").trim(),
          whatsapp: String(input.contact.whatsapp || ownerVendor.contact?.whatsapp || "").trim(),
          website: String(input.contact.website || ownerVendor.contact?.website || "").trim()
        }
      : (ownerVendor.contact || { email: "", phone: "", whatsapp: "", website: "" }),
    availability: {
      ...(ownerVendor.availability && typeof ownerVendor.availability === "object" ? ownerVendor.availability : {}),
      ...availabilitySource,
      parkingMode: String(
        availabilitySource.parkingMode || input.parkingMode || ownerVendor.availability?.parkingMode || ""
      ).trim(),
      parkingSummary: String(
        availabilitySource.parkingSummary || input.parkingSummary || ownerVendor.availability?.parkingSummary || ""
      ).trim(),
      parkingOptions: normalizeStringArray(
        availabilitySource.parkingOptions || input.parkingOptions || ownerVendor.availability?.parkingOptions
      ),
      vendorRules: String(
        availabilitySource.vendorRules || input.vendorRules || ownerVendor.availability?.vendorRules || ""
      ).trim(),
      bookingPolicyTitle: String(
        availabilitySource.bookingPolicyTitle || input.bookingPolicyTitle || ownerVendor.availability?.bookingPolicyTitle || ""
      ).trim(),
      bookingPolicyBody: String(
        availabilitySource.bookingPolicyBody || input.bookingPolicyBody || ownerVendor.availability?.bookingPolicyBody || ""
      ).trim(),
      cancellationPolicyTitle: String(
        availabilitySource.cancellationPolicyTitle || input.cancellationPolicyTitle || ownerVendor.availability?.cancellationPolicyTitle || ""
      ).trim(),
      cancellationPolicyBody: String(
        availabilitySource.cancellationPolicyBody || input.cancellationPolicyBody || ownerVendor.availability?.cancellationPolicyBody || ""
      ).trim(),
      refundPolicyBody: String(
        availabilitySource.refundPolicyBody || input.refundPolicyBody || ownerVendor.availability?.refundPolicyBody || ""
      ).trim(),
      healthSafetyMeasures: normalizeStringArray(
        availabilitySource.healthSafetyMeasures || input.healthSafetyMeasures || ownerVendor.availability?.healthSafetyMeasures
      ),
      includedFeatures: normalizeStringArray(
        availabilitySource.includedFeatures || input.includedFeatures || ownerVendor.availability?.includedFeatures
      )
    }
  };
}

function getWorkspaceListingsFromSettings(settingsPayload = {}, ownerVendor = {}) {
  const source = Array.isArray(settingsPayload?.listings) ? settingsPayload.listings : [];
  return source
    .map((item) => normalizeWorkspaceListingRecord(item, ownerVendor))
    .filter((item) => item.businessName && item.slug);
}

function getLocalVendorWorkspaceSettingsRecord(db, slug) {
  const vendor = getVendorBySlug(db, slug);
  if (!vendor) return null;
  const settings = Array.isArray(db.vendorWorkspaceSettings) ? db.vendorWorkspaceSettings : [];
  const existing = settings.find((entry) => entry.vendorSlug === slug || entry.vendorId === vendor.id);
  if (existing) return existing;
  const nextRecord = {
    vendorId: vendor.id,
    vendorSlug: slug,
    payload: {}
  };
  db.vendorWorkspaceSettings = [...settings, nextRecord];
  return nextRecord;
}

function readLocalVendorWorkspaceSettings(db, slug) {
  const record = getLocalVendorWorkspaceSettingsRecord(db, slug);
  return record ? record.payload || {} : null;
}

async function writeLocalVendorWorkspaceSettings(db, slug, payload) {
  const record = getLocalVendorWorkspaceSettingsRecord(db, slug);
  if (!record) return null;
  record.payload = payload && typeof payload === "object" ? payload : {};
  await writeDb(db);
  return record.payload;
}

async function handleApi(req, res, url) {
  const { pathname, searchParams } = url;
  const supabaseDataReady = await isSupabaseDataSchemaReady();
  const db = supabaseDataReady ? null : await readDb();

  if (req.method === "GET" && pathname === "/api/health/supabase") {
    const config = getSupabaseConfig();
    const productionHealthCheck =
      process.env.VERCEL_ENV === "production" ||
      /^https:\/\/(?:www\.)?event-sphere\.ca/i.test(config.appBaseUrl || "");

    if (productionHealthCheck) {
      const identity = await requireAdminRequest(req, res);
      if (!identity) return;
    }

    const supabase = createSupabaseAdminClient();
    const dataReady = supabaseDataReady;

    if (!supabase) {
      return sendJson(res, 200, {
        configured: false,
        connected: false,
        dataReady,
        mode: "local",
        config
      });
    }

    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1
    });

    return sendJson(res, 200, {
      configured: true,
      connected: !error,
      dataReady,
      mode: dataReady ? "supabase" : "hybrid",
      config,
      error: error ? error.message : null,
      sampleUsers: Array.isArray(data?.users) ? data.users.length : 0
    });
  }

  if (req.method === "GET" && pathname === "/api/bootstrap") {
    if (supabaseDataReady) {
      const payload = await fetchSupabaseBootstrapData();
      return sendJson(res, 200, payload);
    }
    const approvedVendors = db.vendors.filter((vendor) => vendor.status === "approved");
    const approvedVenues = db.venues.filter((venue) => venue.status === "approved");
    return sendJson(res, 200, {
      stats: {
        vendors: approvedVendors.length,
        venues: approvedVenues.length,
        cities: collectCities(db).length,
        categories: collectCategories(db).length
      },
      heroVendor: withCardFields(approvedVendors.find((vendor) => vendor.featured) || approvedVendors[0]),
      featuredVendors: approvedVendors.filter((vendor) => vendor.featured).slice(0, 6).map(withCardFields),
      featuredVenues: approvedVenues.filter((venue) => venue.featured).slice(0, 4).map(withCardFields),
      categories: collectCategories(db),
      cities: collectCities(db)
    });
  }

  if (req.method === "GET" && pathname === "/api/vendors") {
    const type = searchParams.get("type") || "all";
    const category = searchParams.get("category") || "";
    const city = searchParams.get("city") || "";
    const search = searchParams.get("q") || "";

    if (supabaseDataReady) {
      const payload = await fetchSupabaseArchiveData({ type, category, city, search });
      let results = payload.results;

      if (type === "vendor" || type === "all") {
        const baseVendors = payload.results.filter((item) => item.type === "vendor");
        const extras = (
          await Promise.all(
            baseVendors.map(async (vendor) => {
              const settings = await readVendorWorkspaceSettingsBySlug(vendor.slug);
              return settings ? getWorkspaceListingsFromSettings(settings.payload, vendor) : [];
            })
          )
        ).flat().filter((item) => item.status === "approved" && matchesListingFilters(item, { category, city, search }));

        results = sortListingsByFeaturedAndRating([...payload.results, ...extras]);
      }

      const mergedCategories = [...new Set(results.filter((item) => item.type === "vendor").map((item) => item.category).filter(Boolean))]
        .sort()
        .map((name) => ({ name, count: results.filter((item) => item.type === "vendor" && item.category === name).length }));
      const mergedCities = [...new Set(results.map((item) => item.city).filter(Boolean))].sort();

      return sendJson(res, 200, {
        filters: { type, category, city, q: search },
        categories: mergedCategories,
        cities: mergedCities,
        results
      });
    }

    let items = [];

    if (type === "vendor" || type === "all") {
      items.push(...db.vendors.filter((item) => item.status === "approved"));
      const workspaceItems = db.vendors
        .filter((item) => item.status === "approved")
        .flatMap((vendor) => getWorkspaceListingsFromSettings(readLocalVendorWorkspaceSettings(db, vendor.slug), vendor))
        .filter((item) => item.status === "approved");
      items.push(...workspaceItems);
    }
    if (type === "venue" || type === "all") {
      items.push(...db.venues.filter((item) => item.status === "approved"));
    }

    if (category) {
      items = items.filter((item) => item.category === category);
    }
    if (city) {
      items = items.filter((item) => item.city === city);
    }
    items = searchListings(items, search);

    items.sort((a, b) => {
      if (Number(b.featured) !== Number(a.featured)) {
        return Number(b.featured) - Number(a.featured);
      }
      return (b.rating || 0) - (a.rating || 0);
    });

    return sendJson(res, 200, {
      filters: {
        type,
        category,
        city,
        q: search
      },
      categories: [...new Set(items.filter((item) => item.type === "vendor").map((item) => item.category).filter(Boolean))]
        .sort()
        .map((name) => ({ name, count: items.filter((item) => item.type === "vendor" && item.category === name).length })),
      cities: [...new Set(items.map((item) => item.city).filter(Boolean))].sort(),
      results: items.map(withCardFields)
    });
  }

  if (req.method === "GET" && pathname.startsWith("/api/vendors/")) {
    const slug = pathname.replace("/api/vendors/", "");
    if (supabaseDataReady) {
      let payload = await fetchSupabaseListingBySlug(slug);
      if (!payload) {
        const vendorArchive = await fetchSupabaseArchiveData({ type: "vendor", category: "", city: "", search: "" });
        const extraListings = (
          await Promise.all(
            vendorArchive.results.map(async (vendor) => {
              const settings = await readVendorWorkspaceSettingsBySlug(vendor.slug);
              return settings ? getWorkspaceListingsFromSettings(settings.payload, vendor) : [];
            })
          )
        ).flat();
        const match = extraListings.find((item) => item.slug === slug);
        if (!match) {
          return sendJson(res, 404, { error: "Listing not found" });
        }
        const similar = sortListingsByFeaturedAndRating(
          extraListings.filter((item) => item.slug !== slug && item.category === match.category && item.status === "approved")
        ).slice(0, 3);
        payload = { listing: match, similar };
      }
      return sendJson(res, 200, {
        listing: payload.listing,
        similar: payload.similar,
        availability: buildAvailability(payload.listing)
      });
    }

    const item = db.vendors.find((vendor) => vendor.slug === slug) || db.venues.find((venue) => venue.slug === slug);
    const extraListing = item
      ? null
      : db.vendors
          .flatMap((vendor) => getWorkspaceListingsFromSettings(readLocalVendorWorkspaceSettings(db, vendor.slug), vendor))
          .find((entry) => entry.slug === slug);
    const resolvedItem = item || extraListing;
    if (!resolvedItem) {
      return sendJson(res, 404, { error: "Listing not found" });
    }
    const similarSeed = [
      ...db.vendors.filter((vendor) => vendor.status === "approved" && vendor.slug !== slug && vendor.category === resolvedItem.category),
      ...db.vendors.flatMap((vendor) => getWorkspaceListingsFromSettings(readLocalVendorWorkspaceSettings(db, vendor.slug), vendor))
        .filter((vendor) => vendor.status === "approved" && vendor.slug !== slug && vendor.category === resolvedItem.category)
    ];
    const similar = sortListingsByFeaturedAndRating(similarSeed).slice(0, 3).map(withCardFields);
    return sendJson(res, 200, {
      listing: resolvedItem,
      similar,
      availability: buildAvailability(resolvedItem)
    });
  }

  if (req.method === "GET" && pathname.startsWith("/api/dashboard/vendor/")) {
    const slug = pathname.replace("/api/dashboard/vendor/", "");
    const identity = await requireVendorAccess(req, res, slug);
    if (!identity) return;
    if (supabaseDataReady) {
      const payload = await fetchSupabaseVendorDashboard(slug);
      if (!payload) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      return sendJson(res, 200, payload);
    }

    const vendor = getVendorBySlug(db, slug);
    if (!vendor) {
      return sendJson(res, 404, { error: "Vendor not found" });
    }
    const openLeads = db.leads
      .filter((lead) => lead.vendorSlug === slug)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

    return sendJson(res, 200, {
      vendor,
      openLeads
    });
  }

  if (req.method === "PUT" && pathname.startsWith("/api/dashboard/vendor/")) {
    const slug = pathname.replace("/api/dashboard/vendor/", "");
    const identity = await requireVendorAccess(req, res, slug);
    if (!identity) return;
    if (supabaseDataReady) {
      const body = await parseBody(req);
      const vendor = await updateSupabaseVendorBySlug(slug, body);
      if (!vendor) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      return sendJson(res, 200, { ok: true, vendor });
    }

    const vendor = getVendorBySlug(db, slug);
    if (!vendor) {
      return sendJson(res, 404, { error: "Vendor not found" });
    }
    const body = await parseBody(req);
    vendor.businessName = body.businessName || vendor.businessName;
    vendor.ownerName = body.ownerName || vendor.ownerName;
    vendor.category = body.category || vendor.category;
    vendor.city = body.city || vendor.city;
    vendor.province = body.province || vendor.province;
    vendor.priceFrom = Number(body.priceFrom) || vendor.priceFrom;
    vendor.yearsInBusiness = body.yearsInBusiness || vendor.yearsInBusiness;
    vendor.teamSize = body.teamSize || vendor.teamSize;
    vendor.languages = normalizeStringArray(body.languages || vendor.languages);
    vendor.serviceStyle = body.serviceStyle || vendor.serviceStyle;
    vendor.culturalSpecialties = normalizeStringArray(body.culturalSpecialties || vendor.culturalSpecialties);
    vendor.serviceAreas = normalizeStringArray(body.serviceAreas || vendor.serviceAreas);
    vendor.travelRadius = body.travelRadius || vendor.travelRadius;
    vendor.remotePlanning = body.remotePlanning || vendor.remotePlanning;
    vendor.instagram = body.instagram || vendor.instagram;
    vendor.tiktok = body.tiktok || vendor.tiktok;
    vendor.facebook = body.facebook || vendor.facebook;
    vendor.image = body.avatarImage || vendor.image;
    vendor.description = body.description || vendor.description;
    vendor.longDescription = body.longDescription || vendor.longDescription;
    if (Array.isArray(body.gallery)) {
      vendor.gallery = body.gallery.filter(Boolean);
    }
    vendor.contact = {
      ...(vendor.contact || {}),
      email: body.email || vendor.contact?.email || "",
      phone: body.phone || vendor.contact?.phone || "",
      whatsapp: body.whatsapp || vendor.contact?.whatsapp || "",
      website: body.website || vendor.contact?.website || ""
    };
    vendor.availability = {
      ...(vendor.availability || {}),
      window: body.availabilityWindow || vendor.availability?.window || "",
      minimumNotice: body.minimumNotice || vendor.availability?.minimumNotice || "",
      consultationHours: body.consultationHours || vendor.availability?.consultationHours || "",
      bookingCutoff: body.bookingCutoff || vendor.availability?.bookingCutoff || "",
      availableWeekdays: normalizeStringArray(body.availableWeekdays || vendor.availability?.availableWeekdays),
      blackoutDates: normalizeStringArray(body.blackoutDates || vendor.availability?.blackoutDates)
    };
    vendor.tags = normalizeStringArray(body.tags || vendor.tags);
    if (Array.isArray(body.servicePackages)) {
      vendor.servicePackages = body.servicePackages
        .map((service, index) => ({
          id: service.id || `service-${index + 1}`,
          name: String(service.name || service.title || "").trim(),
          area: String(service.area || "").trim(),
          priceFrom: Number(service.priceFrom) || 0,
          turnaround: String(service.turnaround || "").trim(),
          description: String(service.description || "").trim()
        }))
        .filter((service) => service.name || service.description || service.priceFrom);
    }
    await writeDb(db);
    return sendJson(res, 200, { ok: true, vendor });
  }

  if (req.method === "POST" && pathname.match(/^\/api\/dashboard\/vendor\/[^/]+\/leads$/)) {
    const slug = pathname.split("/")[4];
    const identity = await requireVendorAccess(req, res, slug);
    if (!identity) return;
    if (supabaseDataReady) {
      const body = await parseBody(req);
      const lead = await createSupabaseLeadForVendor(slug, body);
      if (!lead) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      return sendJson(res, 201, { ok: true, lead });
    }

    const vendor = getVendorBySlug(db, slug);
    if (!vendor) {
      return sendJson(res, 404, { error: "Vendor not found" });
    }
    const body = await parseBody(req);
    const timestamp = nowIso();
    const lead = {
      id: body.id || `lead-${Date.now()}`,
      vendorSlug: slug,
      name: String(body.name || "").trim(),
      phone: String(body.phone || "").trim(),
      email: String(body.email || "").trim(),
      eventType: String(body.eventType || "").trim(),
      city: String(body.city || "").trim(),
      guests: body.guests || "",
      budget: String(body.budget || "").trim(),
      quoteAmount: String(body.quoteAmount || "").trim(),
      due: String(body.due || "Today").trim(),
      eventDate: String(body.eventDate || "").trim(),
      serviceDetails: String(body.serviceDetails || "").trim(),
      notes: String(body.notes || "").trim(),
      status: String(body.status || "New inquiry").trim(),
      createdAt: timestamp,
      updatedAt: timestamp
    };
    db.leads.unshift(lead);
    await writeDb(db);
    return sendJson(res, 201, { ok: true, lead });
  }

  if (req.method === "PATCH" && pathname.match(/^\/api\/dashboard\/vendor\/[^/]+\/leads\/[^/]+$/)) {
    const [, , , , slug, , leadId] = pathname.split("/");
    const identity = await requireVendorAccess(req, res, slug);
    if (!identity) return;
    if (supabaseDataReady) {
      const body = await parseBody(req);
      const lead = await updateSupabaseLeadForVendor(slug, leadId, body);
      if (!lead) {
        return sendJson(res, 404, { error: "Lead not found" });
      }
      return sendJson(res, 200, { ok: true, lead });
    }

    const lead = db.leads.find((item) => item.vendorSlug === slug && item.id === leadId);
    if (!lead) {
      return sendJson(res, 404, { error: "Lead not found" });
    }
    const body = await parseBody(req);
    Object.assign(lead, body, { updatedAt: nowIso() });
    await writeDb(db);
    return sendJson(res, 200, { ok: true, lead });
  }

  if (req.method === "GET" && pathname === "/api/dashboard/admin") {
    const identity = await requireAdminRequest(req, res);
    if (!identity) return;
    if (supabaseDataReady) {
      const payload = await fetchSupabaseAdminDashboard();
      return sendJson(res, 200, payload);
    }

    const vendors = db.vendors.slice().sort((a, b) => {
      if (a.status !== b.status) {
        return a.status.localeCompare(b.status);
      }
      return a.businessName.localeCompare(b.businessName);
    });
    return sendJson(res, 200, {
      counts: buildAdminCounts(vendors),
      vendors: vendors.map(withCardFields),
      users: db.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorSlug: user.vendorSlug || null
      })),
      requests: sortByDateRank(db.adminRequests),
      reviewRequests: [...db.reviewRequests].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)),
      reviews: [...db.reviews].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    });
  }

  if (req.method === "GET" && pathname === "/api/settings/admin") {
    const identity = await requireAdminRequest(req, res);
    if (!identity) return;

    if (supabaseDataReady) {
      const payload = await readAppSettings();
      return sendJson(res, 200, { settings: payload });
    }

    return sendJson(res, 200, { settings: {} });
  }

  if (req.method === "PUT" && pathname === "/api/settings/admin") {
    const identity = await requireAdminRequest(req, res);
    if (!identity) return;

    const body = await parseBody(req);

    if (supabaseDataReady) {
      const payload = await writeAppSettings(body);
      return sendJson(res, 200, { ok: true, settings: payload });
    }

    return sendJson(res, 200, { ok: true, settings: body });
  }

  if (req.method === "GET" && pathname.startsWith("/api/settings/vendor/")) {
    const slug = pathname.replace("/api/settings/vendor/", "");
    const identity = await requireVendorAccess(req, res, slug);
    if (!identity) return;

    if (supabaseDataReady) {
      const payload = await readVendorWorkspaceSettingsBySlug(slug);
      if (!payload) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      return sendJson(res, 200, { settings: payload.payload });
    }

    return sendJson(res, 200, { settings: readLocalVendorWorkspaceSettings(db, slug) || {} });
  }

  if (req.method === "PUT" && pathname.startsWith("/api/settings/vendor/")) {
    const slug = pathname.replace("/api/settings/vendor/", "");
    const identity = await requireVendorAccess(req, res, slug);
    if (!identity) return;

    const body = await parseBody(req);

    if (supabaseDataReady) {
      const payload = await writeVendorWorkspaceSettingsBySlug(slug, body);
      if (!payload) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      return sendJson(res, 200, { ok: true, settings: payload.payload });
    }

    const payload = await writeLocalVendorWorkspaceSettings(db, slug, body);
    if (!payload) {
      return sendJson(res, 404, { error: "Vendor not found" });
    }
    return sendJson(res, 200, { ok: true, settings: payload });
  }

  if (req.method === "POST" && pathname.match(/^\/api\/dashboard\/vendor\/[^/]+\/listings$/)) {
    const slug = pathname.split("/")[4];
    const identity = await requireVendorAccess(req, res, slug);
    if (!identity) return;
    const body = await parseBody(req);

    if (supabaseDataReady) {
      const vendorPayload = await fetchSupabaseVendorDashboard(slug);
      if (!vendorPayload?.vendor) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      const settingsRecord = await readVendorWorkspaceSettingsBySlug(slug);
      if (!settingsRecord) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      const nextListing = normalizeWorkspaceListingRecord(body, vendorPayload.vendor);
      const currentPayload = settingsRecord.payload && typeof settingsRecord.payload === "object" ? settingsRecord.payload : {};
      const currentListings = getWorkspaceListingsFromSettings(currentPayload, vendorPayload.vendor);
      const nextListings = [nextListing, ...currentListings.filter((item) => workspaceListingIdentity(item) !== workspaceListingIdentity(nextListing))];
      const updated = await writeVendorWorkspaceSettingsBySlug(slug, { ...currentPayload, listings: nextListings });
      return sendJson(res, 201, { ok: true, listing: nextListing, settings: updated?.payload || {} });
    }

    const vendor = getVendorBySlug(db, slug);
    if (!vendor) {
      return sendJson(res, 404, { error: "Vendor not found" });
    }
    const currentPayload = readLocalVendorWorkspaceSettings(db, slug) || {};
    const currentListings = getWorkspaceListingsFromSettings(currentPayload, vendor);
    const nextListing = normalizeWorkspaceListingRecord(body, vendor);
    const nextPayload = {
      ...currentPayload,
      listings: [nextListing, ...currentListings.filter((item) => workspaceListingIdentity(item) !== workspaceListingIdentity(nextListing))]
    };
    await writeLocalVendorWorkspaceSettings(db, slug, nextPayload);
    return sendJson(res, 201, { ok: true, listing: nextListing, settings: nextPayload });
  }

  if (req.method === "PATCH" && pathname.match(/^\/api\/dashboard\/vendor\/[^/]+\/listings\/[^/]+$/)) {
    const [, , , , slug, , listingId] = pathname.split("/");
    const identity = await requireVendorAccess(req, res, slug);
    if (!identity) return;
    const body = await parseBody(req);

    if (supabaseDataReady) {
      const vendorPayload = await fetchSupabaseVendorDashboard(slug);
      if (!vendorPayload?.vendor) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      const settingsRecord = await readVendorWorkspaceSettingsBySlug(slug);
      if (!settingsRecord) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      const currentPayload = settingsRecord.payload && typeof settingsRecord.payload === "object" ? settingsRecord.payload : {};
      const currentListings = getWorkspaceListingsFromSettings(currentPayload, vendorPayload.vendor);
      const existing = currentListings.find((item) => workspaceListingIdentity(item) === listingId || item.slug === listingId);
      if (!existing) {
        return sendJson(res, 404, { error: "Listing not found" });
      }
      const nextListing = normalizeWorkspaceListingRecord({ ...existing, ...body }, vendorPayload.vendor);
      const nextListings = currentListings.map((item) => (workspaceListingIdentity(item) === listingId || item.slug === listingId ? nextListing : item));
      const updated = await writeVendorWorkspaceSettingsBySlug(slug, { ...currentPayload, listings: nextListings });
      return sendJson(res, 200, { ok: true, listing: nextListing, settings: updated?.payload || {} });
    }

    const vendor = getVendorBySlug(db, slug);
    if (!vendor) {
      return sendJson(res, 404, { error: "Vendor not found" });
    }
    const currentPayload = readLocalVendorWorkspaceSettings(db, slug) || {};
    const currentListings = getWorkspaceListingsFromSettings(currentPayload, vendor);
    const existing = currentListings.find((item) => workspaceListingIdentity(item) === listingId || item.slug === listingId);
    if (!existing) {
      return sendJson(res, 404, { error: "Listing not found" });
    }
    const nextListing = normalizeWorkspaceListingRecord({ ...existing, ...body }, vendor);
    const nextPayload = {
      ...currentPayload,
      listings: currentListings.map((item) => (workspaceListingIdentity(item) === listingId || item.slug === listingId ? nextListing : item))
    };
    await writeLocalVendorWorkspaceSettings(db, slug, nextPayload);
    return sendJson(res, 200, { ok: true, listing: nextListing, settings: nextPayload });
  }

  if (req.method === "DELETE" && pathname.match(/^\/api\/dashboard\/vendor\/[^/]+\/listings\/[^/]+$/)) {
    const [, , , , slug, , listingId] = pathname.split("/");
    const identity = await requireVendorAccess(req, res, slug);
    if (!identity) return;

    if (supabaseDataReady) {
      const vendorPayload = await fetchSupabaseVendorDashboard(slug);
      if (!vendorPayload?.vendor) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      const settingsRecord = await readVendorWorkspaceSettingsBySlug(slug);
      if (!settingsRecord) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      const currentPayload = settingsRecord.payload && typeof settingsRecord.payload === "object" ? settingsRecord.payload : {};
      const currentListings = getWorkspaceListingsFromSettings(currentPayload, vendorPayload.vendor);
      const nextListings = currentListings.filter((item) => workspaceListingIdentity(item) !== listingId && item.slug !== listingId);
      const updated = await writeVendorWorkspaceSettingsBySlug(slug, { ...currentPayload, listings: nextListings });
      return sendJson(res, 200, { ok: true, settings: updated?.payload || {} });
    }

    const vendor = getVendorBySlug(db, slug);
    if (!vendor) {
      return sendJson(res, 404, { error: "Vendor not found" });
    }
    const currentPayload = readLocalVendorWorkspaceSettings(db, slug) || {};
    const currentListings = getWorkspaceListingsFromSettings(currentPayload, vendor);
    const nextPayload = {
      ...currentPayload,
      listings: currentListings.filter((item) => workspaceListingIdentity(item) !== listingId && item.slug !== listingId)
    };
    await writeLocalVendorWorkspaceSettings(db, slug, nextPayload);
    return sendJson(res, 200, { ok: true, settings: nextPayload });
  }

  if (req.method === "PATCH" && pathname.startsWith("/api/admin/vendors/")) {
    const id = pathname.replace("/api/admin/vendors/", "");
    const identity = await requireAdminRequest(req, res);
    if (!identity) return;
    if (supabaseDataReady) {
      const body = await parseBody(req);
      const payload = await updateSupabaseAdminVendor(id, body);
      if (!payload) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      return sendJson(res, 200, { ok: true, vendor: payload.vendor, counts: payload.counts });
    }

    const vendor = db.vendors.find((item) => item.id === id);
    if (!vendor) {
      return sendJson(res, 404, { error: "Vendor not found" });
    }
    const body = await parseBody(req);
    if (typeof body.status === "string") {
      vendor.status = body.status;
      vendor.reviewStatus = body.status;
      vendor.verified = body.status === "approved";
    }
    if (typeof body.reviewStatus === "string") {
      vendor.reviewStatus = body.reviewStatus;
    }
    if (typeof body.featured === "boolean") {
      vendor.featured = body.featured;
    }
    if (typeof body.rejectionReason === "string") {
      vendor.rejectionReason = body.rejectionReason;
      vendor.rejectedAt = body.rejectedAt || "Just now";
    }
    await writeDb(db);
    return sendJson(res, 200, { ok: true, vendor: withCardFields(vendor), counts: buildAdminCounts(db.vendors) });
  }

  if (req.method === "PATCH" && pathname.startsWith("/api/admin/requests/")) {
    const id = pathname.replace("/api/admin/requests/", "");
    const identity = await requireAdminRequest(req, res);
    if (!identity) return;
    if (supabaseDataReady) {
      const body = await parseBody(req);
      const request = await updateSupabaseAdminRequest(id, body);
      return sendJson(res, 200, { ok: true, request });
    }

    const request = db.adminRequests.find((item) => item.id === id);
    if (!request) {
      return sendJson(res, 404, { error: "Request not found" });
    }
    const body = await parseBody(req);
    if (typeof body.status === "string") {
      request.activity = Array.isArray(request.activity) ? request.activity : [];
      if (request.status !== body.status) {
        request.activity.push({
          id: `status-${Date.now()}`,
          label: `Status changed to ${body.status}`,
          body: body.note || "",
          at: nowIso(),
          actor: "Admin"
        });
      }
      request.status = body.status;
    }
    if (typeof body.note === "string") {
      request.adminNote = body.note;
    }
    if (typeof body.reply === "string" && body.reply.trim()) {
      const now = nowIso();
      request.adminReply = body.reply.trim();
      request.activity = Array.isArray(request.activity) ? request.activity : [];
      request.activity.push({
        id: `reply-${Date.now()}`,
        label: "Admin replied",
        body: request.adminReply,
        at: now,
        actor: "Admin"
      });
    }
    request.updatedAt = nowIso();
    await writeDb(db);
    return sendJson(res, 200, { ok: true, request });
  }

  if (req.method === "POST" && pathname === "/api/email-demos") {
    const identity = await requireAuthenticatedRequest(req, res);
    if (!identity) return;

    const body = await parseBody(req);
    const demoType = String(body.demoType || "").trim();
    const targetEmail = String(body.targetEmail || identity.session?.email || "").trim();
    if (!targetEmail) {
      return sendJson(res, 400, { error: "Target email is required" });
    }

    const vendorName = String(body.vendorName || identity.session?.name || "Golden Beats DJ Services").trim();
    const vendorSlug = String(body.vendorSlug || identity.session?.vendorSlug || "golden-beats-dj-services").trim();
    const demos = {
      application: {
        eventType: "vendor_application_submitted_admin",
        relatedTable: "email_demo",
        payload: {
          vendorName,
          applicantName: "Marcus A.",
          category: "DJ & MC",
          city: "Toronto, Ontario",
          email: targetEmail,
          submittedAt: new Date().toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" })
        }
      },
      approval: {
        eventType: "vendor_listing_approved",
        relatedTable: "email_demo",
        payload: {
          vendorName,
          loginUrl: `${req.headers.origin || "http://localhost:5173"}/vendor`,
          temporaryPassword: "DemoOnly-123"
        }
      },
      rejection: {
        eventType: "vendor_listing_rejected",
        relatedTable: "email_demo",
        payload: {
          vendorName,
          rejectionReason: "Demo reason: the listing needs a clearer service description, updated contact details, and stronger portfolio examples before approval."
        }
      },
      review: {
        eventType: "review_request_invite",
        relatedTable: "email_demo",
        payload: {
          vendorName,
          vendorSlug,
          clientName: "Amina O.",
          clientEmail: targetEmail,
          eventType: "Wedding reception"
        }
      },
      support: {
        eventType: "support_request_status_updated",
        relatedTable: "email_demo",
        payload: {
          requester: vendorName,
          subject: "Calendar availability question",
          status: "In progress",
          adminReply: "Thanks for sending this through. We are reviewing the calendar issue now and will update your request once it has been resolved."
        }
      },
      supportAlert: {
        eventType: "support_request_created_admin",
        relatedTable: "email_demo",
        payload: {
          requester: vendorName,
          vendorName,
          subject: "Calendar availability question",
          priority: "High",
          email: targetEmail,
          message: "The vendor is asking for help because unavailable calendar dates are still appearing as open on the marketplace listing."
        }
      },
      supportResponse: {
        eventType: "support_request_status_updated",
        relatedTable: "email_demo",
        payload: {
          requester: vendorName,
          subject: "Calendar availability question",
          status: "In progress",
          adminReply: "Thanks for sending this through. We are reviewing the calendar issue now and will update your request once it has been resolved."
        }
      }
    };

    const demo = demos[demoType];
    if (!demo) {
      return sendJson(res, 400, { error: "Unknown demo email type" });
    }

    try {
      const event = await queueEmailEvent({
        eventType: demo.eventType,
        targetEmail,
        relatedTable: demo.relatedTable,
        relatedId: null,
        payload: demo.payload
      });
      return sendJson(res, 200, { ok: true, event });
    } catch (error) {
      return sendJson(res, 500, { error: error.message || "Unable to send demo email" });
    }
  }

  if (req.method === "POST" && pathname.match(/^\/api\/dashboard\/vendor\/[^/]+\/support-requests$/)) {
    const slug = pathname.split("/")[4];
    const identity = await requireVendorAccess(req, res, slug);
    if (!identity) return;
    if (supabaseDataReady) {
      const body = await parseBody(req);
      const request = await createSupabaseSupportRequest(slug, body);
      if (!request) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      return sendJson(res, 201, { ok: true, request });
    }

    const vendor = getVendorBySlug(db, slug);
    if (!vendor) {
      return sendJson(res, 404, { error: "Vendor not found" });
    }
    const body = await parseBody(req);
    const createdAt = nowIso();
    const nextRank = Math.min(...db.adminRequests.map((request) => request.dateRank || 1), 1) - 1;
    const request = {
      id: `vendor-request-${Date.now()}`,
      requester: vendor.businessName,
      requesterSlug: slug,
      subject: String(body.subject || "").trim(),
      type: String(body.type || "Support ticket").trim(),
      priority: String(body.priority || "Normal").trim(),
      age: "Just now",
      dateRank: nextRank,
      email: String(body.email || vendor.contact?.email || "").trim(),
      message: String(body.message || "").trim(),
      status: String(body.status || "pending").trim(),
      createdAt,
      updatedAt: createdAt
    };
    db.adminRequests.unshift(request);
    await writeDb(db);
    return sendJson(res, 201, { ok: true, request });
  }

  if (req.method === "POST" && pathname === "/api/review-requests") {
    const body = await parseBody(req);
    const identity = await requireVendorAccess(req, res, body.vendorSlug);
    if (!identity) return;
    if (supabaseDataReady) {
      const reviewRequest = await createSupabaseReviewRequest(body);
      if (!reviewRequest) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      return sendJson(res, 201, { ok: true, reviewRequest });
    }

    const createdAt = nowIso();
    const reviewRequest = {
      id: `review-request-${Date.now()}`,
      vendorSlug: body.vendorSlug,
      vendorName: body.vendorName,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      eventType: body.eventType || "Booked event",
      sentAt: "Just now",
      status: "sent",
      source: body.source || "Demo email link",
      createdAt,
      updatedAt: createdAt
    };
    db.reviewRequests.unshift(reviewRequest);
    await writeDb(db);
    return sendJson(res, 201, { ok: true, reviewRequest });
  }

  if (req.method === "POST" && pathname === "/api/reviews") {
    if (supabaseDataReady) {
      const body = await parseBody(req);
      const payload = await createSupabaseReview(body);
      if (!payload) {
        return sendJson(res, 404, { error: "Vendor not found" });
      }
      return sendJson(res, 201, { ok: true, review: payload.review, reviewRequest: payload.reviewRequest || null });
    }

    const body = await parseBody(req);
    const createdAt = nowIso();
    const review = {
      id: `review-${Date.now()}`,
      requestId: body.requestId,
      vendorSlug: body.vendorSlug,
      vendorName: body.vendorName,
      reviewerName: body.reviewerName,
      reviewerRole: body.reviewerRole || "Client",
      eventType: body.eventType || "Booked event",
      rating: Number(body.rating || 5),
      body: body.body,
      wouldBookAgain: Boolean(body.wouldBookAgain),
      status: "pending",
      submittedAt: displayDate(createdAt),
      image: body.image || "https://i.pravatar.cc/120?img=48",
      createdAt,
      updatedAt: createdAt
    };
    const reviewRequest = db.reviewRequests.find((item) => item.id === body.requestId);
    if (reviewRequest) {
      reviewRequest.status = "submitted";
      reviewRequest.updatedAt = createdAt;
    }
    db.reviews.unshift(review);
    await writeDb(db);
    return sendJson(res, 201, { ok: true, review, reviewRequest: reviewRequest || null });
  }

  if (req.method === "PATCH" && pathname.startsWith("/api/admin/reviews/")) {
    const id = pathname.replace("/api/admin/reviews/", "");
    const identity = await requireAdminRequest(req, res);
    if (!identity) return;
    if (supabaseDataReady) {
      const body = await parseBody(req);
      const payload = await updateSupabaseReviewStatus(id, body.status);
      return sendJson(res, 200, { ok: true, review: payload.review, reviewRequest: payload.reviewRequest || null });
    }

    const review = db.reviews.find((item) => item.id === id);
    if (!review) {
      return sendJson(res, 404, { error: "Review not found" });
    }
    const body = await parseBody(req);
    if (typeof body.status === "string") {
      review.status = body.status;
    }
    review.updatedAt = nowIso();
    const reviewRequest = review.requestId ? db.reviewRequests.find((item) => item.id === review.requestId) : null;
    if (reviewRequest) {
      reviewRequest.status = review.status;
      reviewRequest.updatedAt = review.updatedAt;
    }
    await writeDb(db);
    return sendJson(res, 200, { ok: true, review, reviewRequest });
  }

  if (req.method === "POST" && pathname === "/api/auth/login") {
    const body = await parseBody(req);
    if (!body.email || !body.password) {
      return sendJson(res, 400, { error: "Email and password are required" });
    }

    const user = db?.users?.find((entry) => entry.email === body.email) || null;
    const config = getSupabaseConfig();
    const supabaseEnabled = config.enabled && config.hasUrl && config.hasAnonKey && config.hasServiceRoleKey;

    if (supabaseEnabled) {
      let signInResult = await signInWithSupabasePassword({
        email: body.email,
        password: body.password
      });

      if (!supabaseDataReady && signInResult.error && user && user.password === body.password) {
        try {
          const vendor = user.vendorSlug ? db?.vendors?.find((entry) => entry.slug === user.vendorSlug) : null;
          await ensureSupabaseAuthUser({
            supabaseAdmin: createSupabaseAdminClient(),
            user,
            password: body.password,
            vendor
          });
          signInResult = await signInWithSupabasePassword({
            email: body.email,
            password: body.password
          });
        } catch (error) {
          return sendJson(res, 502, { error: `Supabase auth setup failed: ${error.message}` });
        }
      }

      if (!signInResult.error && signInResult.user) {
        const authUser = signInResult.user;
        const session = await resolveSupabaseSessionForUser(authUser);
        const hasApprovedAccess = await isVendorWorkspaceApproved({
          role: session.role,
          vendorSlug: session.vendorSlug,
          db,
          supabaseDataReady
        });

        if (!hasApprovedAccess) {
          return sendJson(res, 403, { error: "Vendor portal access is enabled after your application is approved." });
        }

        return sendJson(res, 200, {
          session,
          auth: {
            provider: "supabase",
            userId: authUser.id,
            accessToken: signInResult.session?.access_token || null,
            refreshToken: signInResult.session?.refresh_token || null
          }
        });
      }

      if (signInResult.error) {
        return sendJson(res, 401, { error: "Invalid credentials" });
      }
    }

    if (!db || !user || user.password !== body.password) {
      return sendJson(res, 401, { error: "Invalid credentials" });
    }
    const hasApprovedAccess = await isVendorWorkspaceApproved({
      role: user.role,
      vendorSlug: user.vendorSlug,
      db,
      supabaseDataReady
    });
    if (!hasApprovedAccess) {
      return sendJson(res, 403, { error: "Vendor portal access is enabled after your application is approved." });
    }

    return sendJson(res, 200, {
      session: createSessionFromUser(user),
      auth: {
        provider: "local"
      }
    });
  }

  if (req.method === "POST" && pathname === "/api/auth/session") {
    const identity = await requireAuthenticatedRequest(req, res);
    if (!identity) return;

    return sendJson(res, 200, {
      session: identity.session,
      auth: {
        provider: "supabase",
        userId: identity.authUser?.id || null
      }
    });
  }

  if (req.method === "POST" && pathname === "/api/auth/register") {
    const body = await parseBody(req);
    if (!body.name || !body.email || !body.businessName) {
      return sendJson(res, 400, { error: "Missing required fields" });
    }
    const config = getSupabaseConfig();
    const supabaseEnabled = config.enabled && config.hasUrl && config.hasAnonKey && config.hasServiceRoleKey;

    if (supabaseEnabled) {
      if (!supabaseDataReady) {
        return sendJson(res, 503, { error: "Supabase marketplace schema is not ready yet" });
      }

      try {
        const payload = await createSupabaseVendorApplication(body);
        if (payload?.error) {
          return sendJson(res, payload.statusCode || 409, { error: payload.error });
        }
        return sendJson(res, 201, {
          ok: true,
          application: {
            slug: payload.slug,
            status: "pending",
            notificationStatus: payload.notificationStatus
          }
        });
      } catch (error) {
        if (error?.statusCode) {
          return sendJson(res, error.statusCode, { error: error.error });
        }
        return sendJson(res, 502, { error: `Supabase registration failed: ${error.message}` });
      }
    }

    if (!db) {
      return sendJson(res, 503, { error: "Local registration is disabled while Supabase is active" });
    }
    if (db.users.some((entry) => entry.email === body.email) || db.vendors.some((entry) => entry.contact?.email === body.email)) {
      return sendJson(res, 409, { error: "Email already exists" });
    }
    const slugBase = slugify(body.businessName);
    let slug = slugBase;
    let counter = 2;
    while (db.vendors.some((vendor) => vendor.slug === slug)) {
      slug = `${slugBase}-${counter}`;
      counter += 1;
    }

    const vendor = {
      id: `vendor-${Date.now()}`,
      slug,
      type: "vendor",
      businessName: body.businessName,
      category: body.category || "",
      city: body.city || "",
      province: "Ontario",
      priceFrom: Number(body.priceFrom) || 0,
      rating: 0,
      reviews: 0,
      verified: false,
      featured: false,
      status: "pending",
      reviewStatus: "pending",
      image: "",
      gallery: [],
      description: body.description || "",
      longDescription: body.description || "",
      tags: Array.isArray(body.specialties) ? body.specialties.filter((item) => item && item !== "All") : [],
      languages: [],
      eventTypes: [],
      contact: {
        email: body.email,
        phone: body.phone || "",
        whatsapp: body.whatsapp || "",
        website: body.website || ""
      },
      metrics: {}
    };
    db.vendors.push(vendor);
    await writeDb(db);
    return sendJson(res, 201, {
      ok: true,
      application: {
        slug,
        status: "pending"
      }
    });
  }

  return sendJson(res, 404, { error: "Not found" });
}

module.exports = {
  handleApi
};
