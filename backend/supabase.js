const { createClient } = require("@supabase/supabase-js");
const { readBackendEnv } = require("./env");

function createSupabaseAdminClient() {
  const env = readBackendEnv();
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

function createSupabaseAuthClient() {
  const env = readBackendEnv();
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
}

function getSupabaseConfig() {
  const env = readBackendEnv();
  return {
    enabled: env.supabaseEnabled,
    hasUrl: Boolean(env.supabaseUrl),
    hasAnonKey: Boolean(env.supabaseAnonKey),
    hasServiceRoleKey: Boolean(env.supabaseServiceRoleKey),
    appBaseUrl: env.appBaseUrl,
    hasMailFrom: Boolean(env.mailFrom),
    hasAdminAlertEmail: Boolean(env.adminAlertEmail),
    hasAdminAlertCcEmail: Boolean(env.adminAlertCcEmail),
    hasResendKey: Boolean(env.resendApiKey)
  };
}

async function isSupabaseDataSchemaReady() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return false;

  const { error } = await supabase.from("vendors").select("id").limit(1);
  if (error && /schema cache|Could not find the table/i.test(error.message)) {
    return false;
  }

  return !error;
}

module.exports = {
  createSupabaseAdminClient,
  createSupabaseAuthClient,
  getSupabaseConfig,
  isSupabaseDataSchemaReady
};
