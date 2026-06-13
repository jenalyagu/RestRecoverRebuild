import { createClient } from "@/lib/supabase/server";
import { createId } from "@paralleldrive/cuid2";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { tasks } = await req.json();

  const { data: existing } = await supabase
    .from("village_shares").select("token").eq("user_id", user.id).single();

  const token = existing?.token ?? createId();

  await supabase.from("village_shares").upsert({
    user_id: user.id,
    token,
    tasks,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  return Response.json({ token });
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data } = await supabase.from("village_shares").select("*").eq("user_id", user.id).single();
  return Response.json(data || null);
}
