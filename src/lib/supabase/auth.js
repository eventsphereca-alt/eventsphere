import { getSupabaseBrowserClient, isSupabaseConfigured } from "./client";

export async function signInWithPassword({ email, password }) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase auth is not configured");
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function registerVendorAccount({
  email,
  password,
  fullName,
  businessName,
  role = "vendor"
}) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error("Supabase auth is not configured");
  }

  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        full_name: fullName,
        business_name: businessName,
        app_role: role
      }
    }
  });

  if (error) throw error;
  return data;
}

export function canUseSupabaseAuth() {
  return isSupabaseConfigured();
}
