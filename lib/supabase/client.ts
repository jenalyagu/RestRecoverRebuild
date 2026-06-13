import { createBrowserClient } from "@supabase/ssr";

function safeUrl(val: string | undefined): string {
  if (!val) return "https://placeholder.supabase.co";
  try {
    const u = new URL(val);
    if (u.protocol === "http:" || u.protocol === "https:") return val;
  } catch {}
  return "https://placeholder.supabase.co";
}

const SUPABASE_URL = safeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith("your_")
    ? "placeholder-anon-key"
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}

export function isSupabaseConfigured() {
  return SUPABASE_URL !== "https://placeholder.supabase.co";
}
