const { createSupabaseAdminClient, getSupabaseConfig } = require("./supabase");

const requiredTables = [
  "profiles",
  "vendors",
  "venues",
  "leads",
  "admin_requests",
  "review_requests",
  "reviews",
  "email_events",
  "app_settings",
  "vendor_workspace_settings",
  "vendor_listings",
  "vendor_packages",
  "vendor_policies",
  "clients",
  "quotes",
  "analytics_events",
  "availability_blocks"
];

async function main() {
  const config = getSupabaseConfig();
  console.log("Supabase config:", config);

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    console.error("Supabase admin client is not configured.");
    process.exit(1);
  }

  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1
  });

  if (error) {
    console.error("Supabase verification failed:", error.message);
    process.exit(1);
  }

  console.log("Supabase verification ok. User count sample:", Array.isArray(data?.users) ? data.users.length : 0);

  for (const table of requiredTables) {
    const result = await supabase.from(table).select("*", { count: "exact", head: true }).limit(1);
    if (result.error) {
      console.error(`Missing or inaccessible table: ${table}`);
      console.error(result.error.message);
      process.exit(1);
    }
    console.log(`Table ok: ${table}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
