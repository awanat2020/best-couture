import { createClient } from "@supabase/supabase-js";

const clean = (value: string | undefined) =>
  (value ?? "").trim().replace(/^["']|["']$/g, "");

const rawUrl = clean(import.meta.env.VITE_SUPABASE_URL);
const supabaseKey = clean(import.meta.env.VITE_SUPABASE_KEY);

// Keep only the origin, e.g. https://xxxx.supabase.co (drops any /path or trailing slash)
let supabaseUrl = rawUrl;
try {
  supabaseUrl = new URL(rawUrl).origin;
} catch {
  console.error("VITE_SUPABASE_URL is not a valid URL");
}

console.log("SUPABASE URL:", supabaseUrl, "KEY LENGTH:", supabaseKey.length);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: "pkce",
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true,
  },
});
