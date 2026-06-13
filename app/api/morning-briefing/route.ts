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
    .from("profiles").select("first_name, birth_type, phase_id, week_in_phase, baby_name")
    .eq("user_id", user.id).single();

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];

  const { data: recentCheckin } = await supabase
    .from("daily_checkins").select("mood_score, answers, date")
    .eq("user_id", user.id).gte("date", yesterday).lte("date", today)
    .order("date", { ascending: false }).limit(1).single();

  const MOOD_LABELS = ["", "really hard", "struggling", "managing", "good", "thriving"];
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  const completion = await client().chat.completions.create({
    model: MODEL, max_tokens: 180,
    messages: [
      {
        role: "system",
        content: `You write warm, personal morning briefings for new mothers in a postpartum recovery app. Write exactly 2–3 sentences. Speak directly to her using her name. Reference her current week or phase if relevant. If she checked in recently, acknowledge something specific from it — don't repeat it back robotically, just let it inform the tone. Be warm, grounding, honest. No toxic positivity. No lists. No emoji. No generic advice. End with something that feels like a caring friend who knows exactly where she is.`,
      },
      {
        role: "user",
        content: `Name: ${profile?.first_name || "friend"}
Time of day: ${timeOfDay}
Phase week: week ${profile?.week_in_phase || 1}
Baby name: ${profile?.baby_name || "not shared"}
Birth type: ${profile?.birth_type || "not shared"}
Recent check-in: ${recentCheckin
  ? `Mood: ${MOOD_LABELS[recentCheckin.mood_score] || "not rated"}, emotion: ${recentCheckin.answers?.emotion || "—"}, needed: ${recentCheckin.answers?.need || "—"}`
  : "No recent check-in"}`,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content?.trim() || null;
  return Response.json({ briefing: text });
}
