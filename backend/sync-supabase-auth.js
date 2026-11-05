const { readDb } = require("./db");
const { createSupabaseAdminClient, getSupabaseConfig } = require("./supabase");

async function findSupabaseUserByEmail(supabaseAdmin, email) {
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

function buildUserMetadata(user, vendor) {
  return {
    full_name: user.name,
    app_role: user.role,
    vendor_slug: user.vendorSlug || null,
    business_name: vendor?.businessName || null
  };
}

async function syncAuthUsers() {
  const config = getSupabaseConfig();
  if (!(config.enabled && config.hasUrl && config.hasAnonKey && config.hasServiceRoleKey)) {
    throw new Error("Supabase auth config is incomplete");
  }

  const supabaseAdmin = createSupabaseAdminClient();
  if (!supabaseAdmin) {
    throw new Error("Supabase admin client could not be created");
  }

  const db = await readDb();
  let created = 0;
  let updated = 0;

  for (const user of db.users) {
    const vendor = user.vendorSlug ? db.vendors.find((entry) => entry.slug === user.vendorSlug) : null;
    const existingUser = await findSupabaseUserByEmail(supabaseAdmin, user.email);
    const payload = {
      password: user.password,
      email_confirm: true,
      user_metadata: buildUserMetadata(user, vendor)
    };

    if (existingUser) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, payload);
      if (error) throw error;
      updated += 1;
      continue;
    }

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      ...payload
    });
    if (error) throw error;
    created += 1;
  }

  console.log(`Supabase auth sync complete. Created: ${created}, updated: ${updated}`);
}

syncAuthUsers().catch((error) => {
  console.error("Supabase auth sync failed:", error.message);
  process.exitCode = 1;
});
