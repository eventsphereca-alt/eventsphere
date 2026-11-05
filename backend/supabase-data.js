const { randomBytes } = require("crypto");
const { createSupabaseAdminClient } = require("./supabase");
const { readBackendEnv } = require("./env");
const { queueEmailEvent } = require("./email");

function mapVendorRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    type: "vendor",
    businessName: row.business_name,
    category: row.category,
    city: row.city,
    province: row.province,
    priceFrom: row.price_from,
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews_count || 0),
    verified: Boolean(row.verified),
    featured: Boolean(row.featured),
    status: row.status,
    reviewStatus: row.review_status || row.status || "pending",
    image: row.image_url,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    description: row.description,
    longDescription: row.long_description,
    tags: Array.isArray(row.tags) ? row.tags : [],
    languages: Array.isArray(row.languages) ? row.languages : [],
    eventTypes: Array.isArray(row.event_types) ? row.event_types : [],
    servicePackages: Array.isArray(row.service_packages) ? row.service_packages : [],
    contact: {
      email: row.contact_email || "",
      phone: row.contact_phone || "",
      whatsapp: row.contact_whatsapp || "",
      website: row.contact_website || ""
    },
    instagram: row.instagram || "",
    tiktok: row.tiktok || "",
    facebook: row.facebook || "",
    yearsInBusiness: row.years_in_business || "",
    teamSize: row.team_size || "",
    travelRadius: row.travel_radius || "",
    remotePlanning: row.remote_planning || "",
    serviceStyle: row.service_style || "",
    culturalSpecialties: Array.isArray(row.cultural_specialties) ? row.cultural_specialties : [],
    serviceAreas: Array.isArray(row.service_areas) ? row.service_areas : [],
    availability: row.availability && typeof row.availability === "object" ? row.availability : {},
    metrics: row.metrics && typeof row.metrics === "object" ? row.metrics : {},
    rejectionReason: row.rejection_reason || ""
  };
}

function mapVenueRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    slug: row.slug,
    type: "venue",
    businessName: row.business_name,
    category: row.category,
    city: row.city,
    province: row.province,
    priceFrom: row.price_from,
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews_count || 0),
    verified: Boolean(row.verified),
    featured: Boolean(row.featured),
    status: row.status,
    image: row.image_url,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    description: row.description,
    longDescription: row.long_description,
    tags: Array.isArray(row.tags) ? row.tags : [],
    capacity: row.capacity || null,
    availability: row.availability && typeof row.availability === "object" ? row.availability : {}
  };
}

function mapLeadRow(row, vendorSlug) {
  if (!row) return null;

  return {
    id: row.id,
    vendorSlug,
    name: row.client_name,
    phone: row.client_phone || "",
    email: row.client_email || "",
    eventType: row.event_type || "",
    city: row.city || "",
    guests: row.guests ?? "",
    budget: row.budget || "",
    quoteAmount: row.quote_amount || "",
    due: row.due_label || "",
    eventDate: row.event_date || "",
    serviceDetails: row.service_details || "",
    notes: row.vendor_notes || "",
    status: row.status || "New inquiry",
    quoteId: row.quote_id || null,
    quoteSentAt: row.quote_sent_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapAdminRequestRow(row, vendorSlugById = new Map()) {
  if (!row) return null;

  return {
    id: row.id,
    requester: row.requester,
    requesterSlug: row.requester_slug || vendorSlugById.get(row.vendor_id) || null,
    subject: row.subject,
    type: row.type,
    priority: row.priority,
    age: row.created_at,
    dateRank: row.date_rank || 0,
    email: row.email || "",
    message: row.message,
    status: row.status || "pending",
    adminNote: row.admin_note || "",
    adminReply: row.admin_reply || "",
    activity: Array.isArray(row.activity) ? row.activity : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function findAuthUserByEmail(supabase, email) {
  if (!supabase || !email) return null;

  let page = 1;
  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({
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

function createTemporaryVendorPassword() {
  return `EventSphere!${randomBytes(5).toString("hex")}`;
}

async function ensureVendorAccessProvisioned(vendor) {
  const supabase = createSupabaseAdminClient();
  if (!supabase || !vendor?.id || !vendor.contact_email) {
    return {
      authUserId: vendor?.owner_user_id || null,
      tempPassword: null
    };
  }

  const email = String(vendor.contact_email).trim().toLowerCase();
  const fullName = vendor.business_name || "Event Sphere Vendor";
  const userMetadata = {
    full_name: fullName,
    app_role: "vendor",
    vendor_slug: vendor.slug || null,
    business_name: vendor.business_name || null
  };

  let authUser = null;
  let tempPassword = null;

  if (vendor.owner_user_id) {
    const existingById = await supabase.auth.admin.getUserById(vendor.owner_user_id);
    if (existingById.error && !/user not found/i.test(existingById.error.message || "")) {
      throw existingById.error;
    }
    authUser = existingById.data?.user || null;
  }

  if (!authUser) {
    authUser = await findAuthUserByEmail(supabase, email);
  }

  if (authUser) {
    const needsPasswordProvision = !vendor.owner_user_id || String(authUser.email || "").toLowerCase() === email;
    if (needsPasswordProvision) {
      tempPassword = createTemporaryVendorPassword();
    }

    const updatePayload = {
      email_confirm: true,
      user_metadata: {
        ...(authUser.user_metadata || {}),
        ...userMetadata
      }
    };

    if (tempPassword) {
      updatePayload.password = tempPassword;
    }

    const updated = await supabase.auth.admin.updateUserById(authUser.id, updatePayload);
    if (updated.error) throw updated.error;
    authUser = updated.data?.user || authUser;
  } else {
    tempPassword = createTemporaryVendorPassword();
    const created = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: userMetadata
    });
    if (created.error) throw created.error;
    authUser = created.data?.user || null;
  }

  if (!authUser?.id) {
    throw new Error("Vendor auth user could not be provisioned");
  }

  const profileResult = await supabase
    .from("profiles")
    .upsert({
      id: authUser.id,
      role: "vendor",
      full_name: fullName
    }, {
      onConflict: "id"
    })
    .select("id")
    .single();

  if (profileResult.error) throw profileResult.error;

  if (vendor.owner_user_id !== authUser.id) {
    const vendorUpdate = await supabase
      .from("vendors")
      .update({ owner_user_id: authUser.id })
      .eq("id", vendor.id)
      .select("*")
      .single();

    if (vendorUpdate.error) throw vendorUpdate.error;
    return {
      vendor: vendorUpdate.data,
      authUserId: authUser.id,
      tempPassword
    };
  }

  return {
    vendor,
    authUserId: authUser.id,
    tempPassword
  };
}

function mapReviewRequestRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    vendorSlug: row.vendor_slug,
    vendorName: row.vendor_name,
    clientName: row.client_name,
    clientEmail: row.client_email,
    eventType: row.event_type || "Booked event",
    sentAt: row.sent_at_label || row.created_at,
    status: row.status || "sent",
    source: row.source || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapReviewRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    requestId: row.review_request_id || null,
    vendorSlug: row.vendor_slug,
    vendorName: row.vendor_name,
    reviewerName: row.reviewer_name,
    reviewerRole: row.reviewer_role || "Client",
    eventType: row.event_type || "Booked event",
    rating: Number(row.rating || 5),
    body: row.body,
    wouldBookAgain: row.would_book_again !== false,
    status: row.status || "pending",
    submittedAt: row.submitted_at_label || row.created_at,
    image: row.reviewer_image_url || "https://i.pravatar.cc/120?img=48",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function sortFeaturedThenRating(items) {
  return [...items].sort((a, b) => {
    if (Number(b.featured) !== Number(a.featured)) {
      return Number(b.featured) - Number(a.featured);
    }
    return Number(b.rating || 0) - Number(a.rating || 0);
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

async function readAppSettings() {
  const supabase = createSupabaseAdminClient();
  const result = await supabase.from("app_settings").select("*").eq("key", "platform").maybeSingle();
  if (result.error) {
    if (/schema cache|Could not find the table/i.test(result.error.message)) return {};
    throw result.error;
  }
  return result.data?.payload && typeof result.data.payload === "object" ? result.data.payload : {};
}

async function writeAppSettings(payload) {
  const supabase = createSupabaseAdminClient();
  const result = await supabase
    .from("app_settings")
    .upsert({
      key: "platform",
      payload
    }, { onConflict: "key" })
    .select("*")
    .single();

  if (result.error) {
    if (/schema cache|Could not find the table/i.test(result.error.message)) return payload;
    throw result.error;
  }
  return result.data?.payload && typeof result.data.payload === "object" ? result.data.payload : {};
}

async function readVendorWorkspaceSettingsBySlug(slug) {
  const supabase = createSupabaseAdminClient();
  const vendor = await getVendorRowBySlug(slug);
  if (!vendor) return null;

  const result = await supabase
    .from("vendor_workspace_settings")
    .select("*")
    .eq("vendor_id", vendor.id)
    .maybeSingle();

  if (result.error) {
    if (/schema cache|Could not find the table/i.test(result.error.message)) {
      return {
        vendorId: vendor.id,
        payload: {}
      };
    }
    throw result.error;
  }

  return {
    vendorId: vendor.id,
    payload: result.data?.payload && typeof result.data.payload === "object" ? result.data.payload : {}
  };
}

async function writeVendorWorkspaceSettingsBySlug(slug, payload) {
  const supabase = createSupabaseAdminClient();
  const vendor = await getVendorRowBySlug(slug);
  if (!vendor) return null;

  const result = await supabase
    .from("vendor_workspace_settings")
    .upsert({
      vendor_id: vendor.id,
      payload
    }, { onConflict: "vendor_id" })
    .select("*")
    .single();

  if (result.error) {
    if (/schema cache|Could not find the table/i.test(result.error.message)) {
      return {
        vendorId: vendor.id,
        payload
      };
    }
    throw result.error;
  }

  return {
    vendorId: vendor.id,
    payload: result.data?.payload && typeof result.data.payload === "object" ? result.data.payload : {}
  };
}

async function getVendorRowBySlug(slug) {
  const supabase = createSupabaseAdminClient();
  const result = await supabase.from("vendors").select("*").eq("slug", slug).maybeSingle();
  if (result.error) throw result.error;
  return result.data || null;
}

async function getVendorRowById(id) {
  const supabase = createSupabaseAdminClient();
  const result = await supabase.from("vendors").select("*").eq("id", id).maybeSingle();
  if (result.error) throw result.error;
  return result.data || null;
}

async function fetchSupabaseBootstrapData() {
  const supabase = createSupabaseAdminClient();
  const [{ data: vendors, error: vendorsError }, { data: venues, error: venuesError }] = await Promise.all([
    supabase.from("vendors").select("*").eq("status", "approved"),
    supabase.from("venues").select("*").eq("status", "approved")
  ]);

  if (vendorsError) throw vendorsError;
  if (venuesError) throw venuesError;

  const vendorItems = (vendors || []).map(mapVendorRow);
  const venueItems = (venues || []).map(mapVenueRow);
  const cities = [...new Set([...vendorItems, ...venueItems].map((item) => item.city).filter(Boolean))].sort();
  const categoryCounts = new Map();
  for (const item of vendorItems) {
    categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1);
  }
  const categories = [...categoryCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const featuredVendors = sortFeaturedThenRating(vendorItems).filter((item) => item.featured).slice(0, 6);
  const featuredVenues = sortFeaturedThenRating(venueItems).filter((item) => item.featured).slice(0, 4);

  return {
    stats: {
      vendors: vendorItems.length,
      venues: venueItems.length,
      cities: cities.length,
      categories: categories.length
    },
    heroVendor: featuredVendors[0] || sortFeaturedThenRating(vendorItems)[0] || null,
    featuredVendors,
    featuredVenues,
    categories,
    cities
  };
}

async function fetchSupabaseArchiveData({ type, category, city, search }) {
  const supabase = createSupabaseAdminClient();
  const queries = [];

  if (type === "vendor" || type === "all") {
    queries.push(supabase.from("vendors").select("*").eq("status", "approved"));
  }
  if (type === "venue" || type === "all") {
    queries.push(supabase.from("venues").select("*").eq("status", "approved"));
  }

  const results = await Promise.all(queries);
  const items = [];

  for (const result of results) {
    if (result.error) throw result.error;
    const rows = result.data || [];
    if (rows.length && "owner_user_id" in rows[0]) {
      items.push(...rows.map(mapVendorRow));
    } else {
      items.push(...rows.map(mapVenueRow));
    }
  }

  const filtered = sortFeaturedThenRating(items.filter((item) => {
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
  }));

  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))].sort();
  const cities = [...new Set(items.map((item) => item.city).filter(Boolean))].sort();

  return {
    categories,
    cities,
    results: filtered
  };
}

async function fetchSupabaseListingBySlug(slug) {
  const supabase = createSupabaseAdminClient();
  const vendorResult = await supabase.from("vendors").select("*").eq("slug", slug).maybeSingle();
  if (vendorResult.error) throw vendorResult.error;
  if (vendorResult.data) {
    const listing = mapVendorRow(vendorResult.data);
    const similarResult = await supabase
      .from("vendors")
      .select("*")
      .eq("status", "approved")
      .eq("category", listing.category)
      .neq("slug", slug)
      .limit(3);
    if (similarResult.error) throw similarResult.error;
    return {
      listing,
      similar: (similarResult.data || []).map(mapVendorRow)
    };
  }

  const venueResult = await supabase.from("venues").select("*").eq("slug", slug).maybeSingle();
  if (venueResult.error) throw venueResult.error;
  if (!venueResult.data) return null;

  return {
    listing: mapVenueRow(venueResult.data),
    similar: []
  };
}

async function fetchSupabaseVendorDashboard(slug) {
  const supabase = createSupabaseAdminClient();
  const vendorResult = await supabase.from("vendors").select("*").eq("slug", slug).maybeSingle();
  if (vendorResult.error) throw vendorResult.error;
  if (!vendorResult.data) return null;

  const vendor = mapVendorRow(vendorResult.data);
  const leadsResult = await supabase
    .from("leads")
    .select("*")
    .eq("vendor_id", vendorResult.data.id)
    .order("updated_at", { ascending: false });
  if (leadsResult.error) throw leadsResult.error;

  return {
    vendor,
    openLeads: (leadsResult.data || []).map((row) => mapLeadRow(row, slug))
  };
}

async function fetchSupabaseAdminDashboard() {
  const supabase = createSupabaseAdminClient();
  const [vendorsResult, profilesResult, requestsResult, reviewRequestsResult, reviewsResult] = await Promise.all([
    supabase.from("vendors").select("*").order("business_name", { ascending: true }),
    supabase.from("profiles").select("id, role, full_name"),
    supabase.from("admin_requests").select("*").order("date_rank", { ascending: true }),
    supabase.from("review_requests").select("*").order("updated_at", { ascending: false }),
    supabase.from("reviews").select("*").order("updated_at", { ascending: false })
  ]);

  for (const result of [vendorsResult, profilesResult, requestsResult, reviewRequestsResult, reviewsResult]) {
    if (result.error) throw result.error;
  }

  const vendors = (vendorsResult.data || []).map(mapVendorRow);
  const vendorSlugById = new Map((vendorsResult.data || []).map((row) => [row.id, row.slug]));
  const authUsers = [];
  let authPage = 1;

  while (authPage <= 20) {
    const authResult = await supabase.auth.admin.listUsers({
      page: authPage,
      perPage: 200
    });
    if (authResult.error) throw authResult.error;
    const batch = Array.isArray(authResult.data?.users) ? authResult.data.users : [];
    authUsers.push(...batch);
    if (batch.length < 200) break;
    authPage += 1;
  }

  const authUsersById = new Map(authUsers.map((user) => [user.id, user]));
  const users = (profilesResult.data || []).map((profile) => {
    const ownedVendor = (vendorsResult.data || []).find((vendor) => vendor.owner_user_id === profile.id);
    const authUser = authUsersById.get(profile.id);
    return {
      id: profile.id,
      name: profile.full_name || "Event Sphere User",
      email: authUser?.email || "",
      role: profile.role,
      vendorSlug: ownedVendor?.slug || null
    };
  });

  return {
    counts: {
      pending: vendors.filter((item) => item.status === "pending").length,
      approved: vendors.filter((item) => item.status === "approved").length,
      rejected: vendors.filter((item) => item.status === "rejected").length,
      featured: vendors.filter((item) => item.featured).length
    },
    vendors,
    users,
    requests: (requestsResult.data || []).map((row) => mapAdminRequestRow(row, vendorSlugById)),
    reviewRequests: (reviewRequestsResult.data || []).map(mapReviewRequestRow),
    reviews: (reviewsResult.data || []).map(mapReviewRow)
  };
}

async function updateSupabaseVendorBySlug(slug, body) {
  const supabase = createSupabaseAdminClient();
  const vendor = await getVendorRowBySlug(slug);
  if (!vendor) return null;

  const update = {};

  if ("businessName" in body) update.business_name = body.businessName || vendor.business_name;
  if ("category" in body) update.category = body.category || vendor.category;
  if ("city" in body) update.city = body.city || vendor.city;
  if ("province" in body) update.province = body.province || vendor.province;
  if ("priceFrom" in body) update.price_from = Number(body.priceFrom) || vendor.price_from;
  if ("yearsInBusiness" in body) update.years_in_business = body.yearsInBusiness || vendor.years_in_business;
  if ("teamSize" in body) update.team_size = body.teamSize || vendor.team_size;
  if ("serviceStyle" in body) update.service_style = body.serviceStyle || vendor.service_style;
  if ("travelRadius" in body) update.travel_radius = body.travelRadius || vendor.travel_radius;
  if ("remotePlanning" in body) update.remote_planning = body.remotePlanning || vendor.remote_planning;
  if ("instagram" in body) update.instagram = body.instagram || vendor.instagram;
  if ("tiktok" in body) update.tiktok = body.tiktok || vendor.tiktok;
  if ("facebook" in body) update.facebook = body.facebook || vendor.facebook;
  if ("avatarImage" in body) update.image_url = body.avatarImage || vendor.image_url;
  if ("description" in body) update.description = body.description || vendor.description;
  if ("longDescription" in body) update.long_description = body.longDescription || vendor.long_description;
  if ("gallery" in body && Array.isArray(body.gallery)) update.gallery = body.gallery.filter(Boolean);
  if ("languages" in body) update.languages = normalizeStringArray(body.languages || vendor.languages);
  if ("culturalSpecialties" in body) update.cultural_specialties = normalizeStringArray(body.culturalSpecialties || vendor.cultural_specialties);
  if ("serviceAreas" in body) update.service_areas = normalizeStringArray(body.serviceAreas || vendor.service_areas);
  if ("tags" in body) update.tags = normalizeStringArray(body.tags || vendor.tags);

  if ("servicePackages" in body && Array.isArray(body.servicePackages)) {
    update.service_packages = body.servicePackages
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

  if (
    "email" in body ||
    "phone" in body ||
    "whatsapp" in body ||
    "website" in body
  ) {
    update.contact_email = body.email || vendor.contact_email || "";
    update.contact_phone = body.phone || vendor.contact_phone || "";
    update.contact_whatsapp = body.whatsapp || vendor.contact_whatsapp || "";
    update.contact_website = body.website || vendor.contact_website || "";
  }

  if (
    "availabilityWindow" in body ||
    "minimumNotice" in body ||
    "consultationHours" in body ||
    "bookingCutoff" in body ||
    "availableWeekdays" in body ||
    "blackoutDates" in body ||
    "parkingMode" in body ||
    "parkingSummary" in body ||
    "parkingOptions" in body ||
    "vendorRules" in body ||
    "bookingPolicyTitle" in body ||
    "bookingPolicyBody" in body ||
    "cancellationPolicyTitle" in body ||
    "cancellationPolicyBody" in body ||
    "refundPolicyBody" in body ||
    "healthSafetyMeasures" in body ||
    "includedFeatures" in body
  ) {
    update.availability = {
      ...((vendor.availability && typeof vendor.availability === "object") ? vendor.availability : {}),
      window: body.availabilityWindow || vendor.availability?.window || "",
      minimumNotice: body.minimumNotice || vendor.availability?.minimumNotice || "",
      consultationHours: body.consultationHours || vendor.availability?.consultationHours || "",
      bookingCutoff: body.bookingCutoff || vendor.availability?.bookingCutoff || "",
      availableWeekdays: normalizeStringArray(body.availableWeekdays || vendor.availability?.availableWeekdays),
      blackoutDates: normalizeStringArray(body.blackoutDates || vendor.availability?.blackoutDates),
      parkingMode: body.parkingMode || vendor.availability?.parkingMode || "",
      parkingSummary: body.parkingSummary || vendor.availability?.parkingSummary || "",
      parkingOptions: normalizeStringArray(body.parkingOptions || vendor.availability?.parkingOptions),
      vendorRules: body.vendorRules || vendor.availability?.vendorRules || "",
      bookingPolicyTitle: body.bookingPolicyTitle || vendor.availability?.bookingPolicyTitle || "",
      bookingPolicyBody: body.bookingPolicyBody || vendor.availability?.bookingPolicyBody || "",
      cancellationPolicyTitle: body.cancellationPolicyTitle || vendor.availability?.cancellationPolicyTitle || "",
      cancellationPolicyBody: body.cancellationPolicyBody || vendor.availability?.cancellationPolicyBody || "",
      refundPolicyBody: body.refundPolicyBody || vendor.availability?.refundPolicyBody || "",
      healthSafetyMeasures: normalizeStringArray(body.healthSafetyMeasures || vendor.availability?.healthSafetyMeasures),
      includedFeatures: normalizeStringArray(body.includedFeatures || vendor.availability?.includedFeatures)
    };
  }

  const result = await supabase
    .from("vendors")
    .update(update)
    .eq("id", vendor.id)
    .select("*")
    .single();

  if (result.error) throw result.error;
  return mapVendorRow(result.data);
}

async function createSupabaseLeadForVendor(slug, body) {
  const supabase = createSupabaseAdminClient();
  const vendor = await getVendorRowBySlug(slug);
  if (!vendor) return null;

  const result = await supabase
    .from("leads")
    .insert({
      vendor_id: vendor.id,
      client_name: String(body.name || "").trim(),
      client_phone: String(body.phone || "").trim() || null,
      client_email: String(body.email || "").trim() || null,
      event_type: String(body.eventType || "").trim() || null,
      city: String(body.city || "").trim() || null,
      guests: Number(body.guests) || null,
      budget: String(body.budget || "").trim() || null,
      quote_amount: String(body.quoteAmount || "").trim() || null,
      due_label: String(body.due || "Today").trim() || null,
      event_date: String(body.eventDate || "").trim() || null,
      service_details: String(body.serviceDetails || "").trim() || null,
      vendor_notes: String(body.notes || "").trim() || null,
      status: String(body.status || "New inquiry").trim()
    })
    .select("*")
    .single();

  if (result.error) throw result.error;
  return mapLeadRow(result.data, slug);
}

async function updateSupabaseLeadForVendor(slug, leadId, body) {
  const supabase = createSupabaseAdminClient();
  const vendor = await getVendorRowBySlug(slug);
  if (!vendor) return null;

  const existing = await supabase
    .from("leads")
    .select("*")
    .eq("vendor_id", vendor.id)
    .eq("id", leadId)
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (!existing.data) return null;

  const patch = {};
  if ("status" in body) patch.status = body.status;
  if ("quoteAmount" in body) patch.quote_amount = body.quoteAmount || null;
  if ("quoteId" in body) patch.quote_id = body.quoteId || null;
  if ("quoteSentAt" in body) patch.quote_sent_at = body.quoteSentAt || null;
  if ("name" in body) patch.client_name = body.name || existing.data.client_name;
  if ("phone" in body) patch.client_phone = body.phone || existing.data.client_phone;
  if ("email" in body) patch.client_email = body.email || existing.data.client_email;
  if ("eventType" in body) patch.event_type = body.eventType || existing.data.event_type;
  if ("city" in body) patch.city = body.city || existing.data.city;
  if ("guests" in body) patch.guests = Number(body.guests) || null;
  if ("budget" in body) patch.budget = body.budget || existing.data.budget;
  if ("due" in body) patch.due_label = body.due || existing.data.due_label;
  if ("eventDate" in body) patch.event_date = body.eventDate || existing.data.event_date;
  if ("serviceDetails" in body) patch.service_details = body.serviceDetails || existing.data.service_details;
  if ("notes" in body) patch.vendor_notes = body.notes || existing.data.vendor_notes;

  const result = await supabase
    .from("leads")
    .update(patch)
    .eq("id", leadId)
    .select("*")
    .single();

  if (result.error) throw result.error;
  return mapLeadRow(result.data, slug);
}

async function updateSupabaseAdminVendor(id, body) {
  const supabase = createSupabaseAdminClient();
  const vendor = await getVendorRowById(id);
  if (!vendor) return null;
  const previousStatus = vendor.status;

  const patch = {};
  if ("status" in body) {
    patch.status = body.status;
    patch.review_status = body.status;
    patch.verified = body.status === "approved";
  }
  if ("reviewStatus" in body) patch.review_status = body.reviewStatus;
  if ("featured" in body) patch.featured = Boolean(body.featured);
  if ("rejectionReason" in body) patch.rejection_reason = body.rejectionReason || null;

  const result = await supabase
    .from("vendors")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (result.error) throw result.error;

  let updatedVendorRow = result.data;
  let approvalProvision = null;

  if (body.status === "approved" && body.status !== previousStatus) {
    approvalProvision = await ensureVendorAccessProvisioned(result.data);
    updatedVendorRow = approvalProvision.vendor || updatedVendorRow;
  }

  const countsResult = await supabase.from("vendors").select("status, featured");
  if (countsResult.error) throw countsResult.error;
  const vendors = (countsResult.data || []).map((row) => ({
    status: row.status,
    featured: row.featured
  }));

  if (body.status && body.status !== previousStatus && updatedVendorRow.contact_email) {
    const eventType = body.status === "approved" ? "vendor_listing_approved" : body.status === "rejected" ? "vendor_listing_rejected" : null;
    if (eventType) {
      await queueEmailEvent({
        eventType,
        targetEmail: updatedVendorRow.contact_email,
        relatedTable: "vendors",
        relatedId: updatedVendorRow.id,
        payload: {
          vendorName: updatedVendorRow.business_name,
          vendorSlug: updatedVendorRow.slug,
          rejectionReason: body.rejectionReason || updatedVendorRow.rejection_reason || "",
          loginUrl: readBackendEnv().vendorPortalUrl || `${readBackendEnv().appBaseUrl.replace(/\/$/, "")}/vendor`,
          temporaryPassword: approvalProvision?.tempPassword || ""
        }
      });
    }
  }

  return {
    vendor: mapVendorRow(updatedVendorRow),
    counts: {
      pending: vendors.filter((item) => item.status === "pending").length,
      approved: vendors.filter((item) => item.status === "approved").length,
      rejected: vendors.filter((item) => item.status === "rejected").length,
      featured: vendors.filter((item) => item.featured).length
    }
  };
}

async function updateSupabaseAdminRequest(id, bodyOrStatus) {
  const supabase = createSupabaseAdminClient();
  const existing = await supabase.from("admin_requests").select("*").eq("id", id).maybeSingle();
  if (existing.error) throw existing.error;
  const body = typeof bodyOrStatus === "string" ? { status: bodyOrStatus } : bodyOrStatus || {};
  const status = body.status || existing.data?.status || "pending";
  const previousActivity = Array.isArray(existing.data?.activity) ? existing.data.activity : [];
  const now = new Date().toISOString();
  const activity = [...previousActivity];

  if (status !== existing.data?.status) {
    activity.push({
      id: `status-${Date.now()}`,
      label: `Status changed to ${status}`,
      body: body.note || "",
      at: now,
      actor: "Admin"
    });
  }

  if (body.reply) {
    activity.push({
      id: `reply-${Date.now()}`,
      label: "Admin replied",
      body: body.reply,
      at: now,
      actor: "Admin"
    });
  }

  const result = await supabase
    .from("admin_requests")
    .update({
      status,
      admin_note: body.note ?? existing.data?.admin_note ?? "",
      admin_reply: body.reply || existing.data?.admin_reply || "",
      activity
    })
    .eq("id", id)
    .select("*")
    .single();

  if (result.error) throw result.error;
  if (result.data.email && (existing.data?.status !== status || body.reply)) {
    await queueEmailEvent({
      eventType: "support_request_status_updated",
      targetEmail: result.data.email,
      relatedTable: "admin_requests",
      relatedId: result.data.id,
      payload: {
        requester: result.data.requester,
        subject: result.data.subject,
        status: result.data.status,
        message: result.data.message,
        adminReply: body.reply || "",
        adminNote: body.note || ""
      }
    });
  }
  return mapAdminRequestRow(result.data);
}

async function createSupabaseSupportRequest(slug, body) {
  const supabase = createSupabaseAdminClient();
  const env = readBackendEnv();
  const vendor = await getVendorRowBySlug(slug);
  if (!vendor) return null;

  const result = await supabase
    .from("admin_requests")
    .insert({
      vendor_id: vendor.id,
      requester_user_id: vendor.owner_user_id || null,
      requester: String(body.requester || vendor.business_name || "").trim(),
      requester_slug: slug,
      subject: String(body.subject || "").trim(),
      type: String(body.type || "Support ticket").trim(),
      priority: String(body.priority || "Normal").trim(),
      email: String(body.email || vendor.contact_email || "").trim() || null,
      message: String(body.message || "").trim(),
      status: String(body.status || "pending").trim(),
      date_rank: 0
    })
    .select("*")
    .single();

  if (result.error) throw result.error;
  await queueEmailEvent({
    eventType: "support_request_created_admin",
    targetEmail: env.adminAlertEmail,
    relatedTable: "admin_requests",
    relatedId: result.data.id,
    payload: {
      requester: result.data.requester,
      vendorName: vendor.business_name,
      subject: result.data.subject,
      priority: result.data.priority,
      email: result.data.email,
      message: result.data.message
    }
  });
  return mapAdminRequestRow(result.data, new Map([[vendor.id, slug]]));
}

async function createSupabaseReviewRequest(body) {
  const supabase = createSupabaseAdminClient();
  const vendor = await getVendorRowBySlug(body.vendorSlug);
  if (!vendor) return null;

  const result = await supabase
    .from("review_requests")
    .insert({
      vendor_id: vendor.id,
      vendor_slug: body.vendorSlug,
      vendor_name: body.vendorName,
      client_name: body.clientName,
      client_email: body.clientEmail,
      event_type: body.eventType || "Booked event",
      sent_at_label: "Just now",
      status: "sent",
      source: body.source || "Demo email link"
    })
    .select("*")
    .single();

  if (result.error) throw result.error;
  await queueEmailEvent({
    eventType: "review_request_invite",
    targetEmail: result.data.client_email,
    relatedTable: "review_requests",
    relatedId: result.data.id,
    payload: {
      vendorSlug: result.data.vendor_slug,
      vendorName: result.data.vendor_name,
      clientName: result.data.client_name,
      clientEmail: result.data.client_email,
      eventType: result.data.event_type || "Booked event"
    }
  });
  return mapReviewRequestRow(result.data);
}

async function createSupabaseReview(body) {
  const supabase = createSupabaseAdminClient();
  const vendor = await getVendorRowBySlug(body.vendorSlug);
  if (!vendor) return null;

  const reviewRequestId = body.requestId || null;
  const reviewResult = await supabase
    .from("reviews")
    .insert({
      vendor_id: vendor.id,
      review_request_id: reviewRequestId,
      vendor_slug: body.vendorSlug,
      vendor_name: body.vendorName,
      reviewer_name: body.reviewerName,
      reviewer_role: body.reviewerRole || "Client",
      event_type: body.eventType || "Booked event",
      rating: Number(body.rating || 5),
      body: body.body,
      would_book_again: Boolean(body.wouldBookAgain),
      status: "pending",
      submitted_at_label: new Intl.DateTimeFormat("en-CA", {
        month: "long",
        day: "numeric",
        year: "numeric"
      }).format(new Date()),
      reviewer_image_url: body.image || "https://i.pravatar.cc/120?img=48"
    })
    .select("*")
    .single();
  if (reviewResult.error) throw reviewResult.error;

  let reviewRequest = null;
  if (reviewRequestId) {
    const requestResult = await supabase
      .from("review_requests")
      .update({ status: "submitted" })
      .eq("id", reviewRequestId)
      .select("*")
      .maybeSingle();
    if (requestResult.error) throw requestResult.error;
    if (requestResult.data) {
      reviewRequest = mapReviewRequestRow(requestResult.data);
    }
  }

  return {
    review: mapReviewRow(reviewResult.data),
    reviewRequest
  };
}

async function updateSupabaseReviewStatus(id, status) {
  const supabase = createSupabaseAdminClient();
  const reviewResult = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (reviewResult.error) throw reviewResult.error;

  let reviewRequest = null;
  const reviewRequestId = reviewResult.data.review_request_id;
  if (reviewRequestId) {
    const requestResult = await supabase
      .from("review_requests")
      .update({ status })
      .eq("id", reviewRequestId)
      .select("*")
      .maybeSingle();
    if (requestResult.error) throw requestResult.error;
    if (requestResult.data) {
      reviewRequest = mapReviewRequestRow(requestResult.data);
    }
  }

  return {
    review: mapReviewRow(reviewResult.data),
    reviewRequest
  };
}

module.exports = {
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
};
