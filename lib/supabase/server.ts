import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {}
      },
    },
  });
}
