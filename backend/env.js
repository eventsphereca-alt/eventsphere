const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function parseEnvFile(filename) {
  const filePath = path.join(ROOT, filename);
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function loadBackendEnv() {
  parseEnvFile(".env");
  parseEnvFile(".env.local");
}

function readBackendEnv() {
  loadBackendEnv();

  return {
    supabaseEnabled: String(process.env.SUPABASE_ENABLED || "false").toLowerCase() === "true",
    supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET || "",
    appBaseUrl: process.env.APP_BASE_URL || "http://127.0.0.1:5173",
    adminPortalUrl: process.env.ADMIN_PORTAL_URL || "",
    vendorPortalUrl: process.env.VENDOR_PORTAL_URL || "",
    mailFrom: process.env.MAIL_FROM || "Event Sphere <onboarding@resend.dev>",
    adminAlertEmail: process.env.ADMIN_ALERT_EMAIL || "admin@eventsphere.ca",
    adminAlertCcEmail: process.env.ADMIN_ALERT_CC_EMAIL || "",
    resendApiKey: process.env.RESEND_API_KEY || ""
  };
}

module.exports = {
  loadBackendEnv,
  readBackendEnv
};
