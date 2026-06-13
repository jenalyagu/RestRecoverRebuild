import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function client() {
  return new OpenAI({ apiKey: process.env.GROQ_API_KEY!, baseURL: "https://api.groq.com/openai/v1" });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("first_name").eq("user_id", user.id).single();

  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const { data: checkins } = await supabase
    .from("daily_checkins").select("date, mood_score, answers")
    .eq("user_id", user.id).gte("date", fourteenDaysAgo)
    .order("date", { ascending: true });

  if (!checkins || checkins.length < 3) {
    return Response.json({ narrative: null, reason: "not_enough_data" });
  }

  const MOOD_LABELS = ["", "Really hard", "Struggling", "Managing", "Good", "Thriving"];
  const summary = checkins.map(c => {
    const d = new Date(c.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${d}: mood=${MOOD_LABELS[c.mood_score] || "—"}, emotion="${c.answers?.emotion || "—"}", needed="${c.answers?.need || "—"}"`;
  }).join("\n");

  const completion = await client().chat.completions.create({
    model: MODEL, max_tokens: 320,
    messages: [
      {
        role: "system",
        content: `You write brief, compassionate emotional arc summaries for new mothers reviewing their postpartum check-in history. Write 2–3 short paragraphs that read like a private journal entry looking back. Reference actual patterns you notice — emotional shifts, repeated needs, hard days, better days. Do NOT give advice. Do NOT be clinical. Speak in second person ("you"). This is a mirror, not a report. Help her see herself with kindness. No lists, no headers, no emoji. Honest, warm, literary.`,
      },
      {
        role: "user",
        content: `Name: ${profile?.first_name || "her"}\nLast 14 days of check-ins:\n${summary}`,
      },
    ],
  });

  const narrative = completion.choices[0]?.message?.content?.trim() || null;
  return Response.json({ narrative });
}
