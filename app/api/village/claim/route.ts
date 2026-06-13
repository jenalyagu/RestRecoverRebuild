import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { token, tasks } = await req.json();
  if (!token) return new Response("Missing token", { status: 400 });

  const supabase = await createClient();
  await supabase.from("village_shares").update({ tasks, updated_at: new Date().toISOString() }).eq("token", token);

  return Response.json({ ok: true });
}
