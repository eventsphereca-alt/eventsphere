const crypto = require("crypto");
const { readDb } = require("./db");
const { createSupabaseAdminClient, getSupabaseConfig } = require("./supabase");

function stableUuid(namespace, value) {
  const hash = crypto.createHash("sha1").update(`${namespace}:${value}`).digest("hex");
  const hex = `${hash.slice(0, 8)}${hash.slice(8, 12)}5${hash.slice(13, 16)}a${hash.slice(17, 20)}${hash.slice(20, 32)}`;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function toJsonArray(value) {
  return Array.isArray(value) ? value : [];
}

function toJsonObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function dedupeRowsBy(rows, keyName) {
  const deduped = new Map();
  for (const row of rows) {
    const key = row?.[keyName];
    if (!key) continue;
    deduped.set(key, row);
  }
  return [...deduped.values()];
}

async function listAllAuthUsers(supabaseAdmin) {
  const users = [];
  let page = 1;

  while (page <= 20) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 200
    });
    if (error) throw error;

    const batch = Array.isArray(data?.users) ? data.users : [];
    users.push(...batch);
    if (batch.length < 200) break;
    page += 1;
  }

  return users;
}

async function assertSchemaReady(supabaseAdmin) {
  const { error } = await supabaseAdmin.from("vendors").select("id").limit(1);
  if (error) {
    throw new Error(`Supabase schema is not ready: ${error.message}`);
  }
}

async function seedSupabaseData() {
  const config = getSupabaseConfig();
  if (!(config.enabled && config.hasUrl && config.hasAnonKey && config.hasServiceRoleKey)) {
    throw new Error("Supabase config is incomplete");
  }

  const supabaseAdmin = createSupabaseAdminClient();
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client could not be created");
  }

  await assertSchemaReady(supabaseAdmin);

  const db = await readDb();
  const authUsers = await listAllAuthUsers(supabaseAdmin);
  const authUsersByEmail = new Map(
    authUsers
      .filter((user) => user.email)
      .map((user) => [String(user.email).toLowerCase(), user])
  );

  const vendorOwnerUsers = new Map();
  for (const user of db.users.filter((entry) => entry.role === "vendor" && entry.vendorSlug)) {
    const authUser = authUsersByEmail.get(String(user.email).toLowerCase());
    if (authUser) {
      vendorOwnerUsers.set(user.vendorSlug, authUser.id);
    }
  }

  const profileRows = db.users
    .map((user) => {
      const authUser = authUsersByEmail.get(String(user.email).toLowerCase());
      if (!authUser) return null;

      return {
        id: authUser.id,
        role: user.role,
        full_name: user.name,
        phone: null
      };
    })
    .filter(Boolean);

  if (profileRows.length) {
    const { error } = await supabaseAdmin.from("profiles").upsert(profileRows, {
      onConflict: "id"
    });
    if (error) throw error;
  }

  const vendorIdBySlug = new Map();
  const vendorRows = dedupeRowsBy(db.vendors.map((vendor) => {
    const id = stableUuid("vendor", vendor.slug);
    vendorIdBySlug.set(vendor.slug, id);

    return {
      id,
      owner_user_id: vendorOwnerUsers.get(vendor.slug) || null,
      slug: vendor.slug,
      business_name: vendor.businessName,
      category: vendor.category || null,
      city: vendor.city || null,
      province: vendor.province || null,
      price_from: Number(vendor.priceFrom) || 0,
      rating: Number(vendor.rating) || 0,
      reviews_count: Number(vendor.reviews) || 0,
      verified: Boolean(vendor.verified),
      featured: Boolean(vendor.featured),
      status: vendor.status || "pending",
      review_status: vendor.reviewStatus || vendor.status || "pending",
      description: vendor.description || null,
      long_description: vendor.longDescription || null,
      image_url: vendor.image || null,
      gallery: toJsonArray(vendor.gallery),
      tags: toJsonArray(vendor.tags),
      languages: toJsonArray(vendor.languages),
      event_types: toJsonArray(vendor.eventTypes),
      service_packages: toJsonArray(vendor.servicePackages),
      contact_email: vendor.contact?.email || null,
      contact_phone: vendor.contact?.phone || null,
      contact_whatsapp: vendor.contact?.whatsapp || null,
      contact_website: vendor.contact?.website || null,
      instagram: vendor.instagram || null,
      tiktok: vendor.tiktok || null,
      facebook: vendor.facebook || null,
      years_in_business: vendor.yearsInBusiness || null,
      team_size: vendor.teamSize || null,
      travel_radius: vendor.travelRadius || null,
      remote_planning: vendor.remotePlanning || null,
      service_style: vendor.serviceStyle || null,
      cultural_specialties: toJsonArray(vendor.culturalSpecialties),
      service_areas: toJsonArray(vendor.serviceAreas),
      availability: toJsonObject(vendor.availability),
      metrics: toJsonObject(vendor.metrics),
      rejection_reason: vendor.rejectionReason || null
    };
  }), "slug");

  const venueRows = dedupeRowsBy(db.venues.map((venue) => ({
    id: stableUuid("venue", venue.slug),
    slug: venue.slug,
    business_name: venue.businessName,
    category: venue.category || null,
    city: venue.city || null,
    province: venue.province || null,
    price_from: Number(venue.priceFrom) || 0,
    rating: Number(venue.rating) || 0,
    reviews_count: Number(venue.reviews) || 0,
    verified: Boolean(venue.verified),
    featured: Boolean(venue.featured),
    status: venue.status || "pending",
    description: venue.description || null,
    long_description: venue.longDescription || null,
    image_url: venue.image || null,
    gallery: toJsonArray(venue.gallery),
    tags: toJsonArray(venue.tags),
    capacity: venue.capacity || null,
    availability: toJsonObject(venue.availability)
  })), "slug");

  const leadRows = dedupeRowsBy(db.leads
    .map((lead) => {
      const vendorId = vendorIdBySlug.get(lead.vendorSlug);
      if (!vendorId) return null;
      return {
        id: stableUuid("lead", lead.id),
        vendor_id: vendorId,
        client_name: lead.name || "Unknown client",
        client_phone: lead.phone || null,
        client_email: lead.email || null,
        event_type: lead.eventType || null,
        city: lead.city || null,
        guests: Number(lead.guests) || null,
        budget: lead.budget || null,
        quote_amount: lead.quoteAmount || null,
        due_label: lead.due || null,
        event_date: lead.eventDate || null,
        service_details: lead.serviceDetails || null,
        vendor_notes: lead.notes || null,
        status: lead.status || "New inquiry",
        quote_id: lead.quoteId || null,
        quote_sent_at: lead.quoteSentAt || null
      };
    })
    .filter(Boolean), "id");

  const adminRequestRows = dedupeRowsBy(db.adminRequests.map((request) => ({
    id: stableUuid("admin-request", request.id),
    vendor_id: request.requesterSlug ? vendorIdBySlug.get(request.requesterSlug) || null : null,
    requester_user_id: request.requesterSlug ? vendorOwnerUsers.get(request.requesterSlug) || null : null,
    requester: request.requester,
    requester_slug: request.requesterSlug || null,
    subject: request.subject,
    type: request.type,
    priority: request.priority || "Normal",
    email: request.email || null,
    message: request.message,
    status: request.status || "pending",
    date_rank: Number(request.dateRank) || 0
  })), "id");

  const reviewRequestIdByLegacyId = new Map();
  const reviewRequestRows = dedupeRowsBy(db.reviewRequests
    .map((request) => {
      const vendorId = vendorIdBySlug.get(request.vendorSlug);
      if (!vendorId) return null;
      const id = stableUuid("review-request", request.id);
      reviewRequestIdByLegacyId.set(request.id, id);
      return {
        id,
        vendor_id: vendorId,
        vendor_slug: request.vendorSlug,
        vendor_name: request.vendorName,
        client_name: request.clientName,
        client_email: request.clientEmail,
        event_type: request.eventType || null,
        sent_at_label: request.sentAt || null,
        status: request.status || "sent",
        source: request.source || null
      };
    })
    .filter(Boolean), "id");

  const reviewRows = dedupeRowsBy(db.reviews
    .map((review) => {
      const vendorId = vendorIdBySlug.get(review.vendorSlug);
      if (!vendorId) return null;
      return {
        id: stableUuid("review", review.id),
        vendor_id: vendorId,
        review_request_id: review.requestId ? reviewRequestIdByLegacyId.get(review.requestId) || null : null,
        vendor_slug: review.vendorSlug,
        vendor_name: review.vendorName,
        reviewer_name: review.reviewerName,
        reviewer_role: review.reviewerRole || null,
        event_type: review.eventType || null,
        rating: Number(review.rating) || 5,
        body: review.body,
        would_book_again: review.wouldBookAgain !== false,
        status: review.status || "pending",
        reviewer_image_url: review.image || null,
        submitted_at_label: review.submittedAt || null
      };
    })
    .filter(Boolean), "id");

  if (vendorRows.length) {
    const { error } = await supabaseAdmin.from("vendors").upsert(vendorRows, { onConflict: "slug" });
    if (error) throw error;
  }

  if (venueRows.length) {
    const { error } = await supabaseAdmin.from("venues").upsert(venueRows, { onConflict: "slug" });
    if (error) throw error;
  }

  if (leadRows.length) {
    const { error } = await supabaseAdmin.from("leads").upsert(leadRows, { onConflict: "id" });
    if (error) throw error;
  }

  if (adminRequestRows.length) {
    const { error } = await supabaseAdmin.from("admin_requests").upsert(adminRequestRows, { onConflict: "id" });
    if (error) throw error;
  }

  if (reviewRequestRows.length) {
    const { error } = await supabaseAdmin.from("review_requests").upsert(reviewRequestRows, { onConflict: "id" });
    if (error) throw error;
  }

  if (reviewRows.length) {
    const { error } = await supabaseAdmin.from("reviews").upsert(reviewRows, { onConflict: "id" });
    if (error) throw error;
  }

  console.log(
    `Supabase data seed complete. Profiles: ${profileRows.length}, vendors: ${vendorRows.length}, venues: ${venueRows.length}, leads: ${leadRows.length}, requests: ${adminRequestRows.length}, review requests: ${reviewRequestRows.length}, reviews: ${reviewRows.length}`
  );
}

seedSupabaseData().catch((error) => {
  console.error("Supabase data seed failed:", error.message);
  process.exitCode = 1;
});
