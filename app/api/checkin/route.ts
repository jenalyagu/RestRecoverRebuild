import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const MOOD_LABELS = ["", "Really hard", "Struggling", "Managing", "Good", "Thriving"];

function client() {
  return new OpenAI({ apiKey: process.env.GROQ_API_KEY!, baseURL: "https://api.groq.com/openai/v1" });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { answers, moodScore } = await req.json();
  const today = new Date().toISOString().split("T")[0];

  const { error: saveError } = await supabase.from("daily_checkins").upsert({
    user_id: user.id, date: today, answers,
    mood_score: moodScore, created_at: new Date().toISOString(),
  }, { onConflict: "user_id,date" });

  if (saveError) {
    console.error("Check-in save error:", saveError);
    return Response.json({ error: saveError.message }, { status: 500 });
  }

  let reflection: string | null = null;
  try {
    const { data: profile } = await supabase
      .from("profiles").select("first_name, birth_type, phase_id, week_in_phase")
      .eq("user_id", user.id).single();

    const completion = await client().chat.completions.create({
      model: MODEL, max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `You are a warm, evidence-based postpartum recovery guide. A new mother just completed her daily check-in. Respond with a short reflection (3-4 sentences max): acknowledge what she shared in her own words, validate without toxic positivity, and offer ONE small, concrete suggestion for the rest of today. Speak directly to her. No lists, no headers, no emoji. If she mentions severe pain, heavy bleeding, fever, or thoughts of harming herself or the baby, gently but clearly tell her to contact her healthcare provider or emergency services now.`,
        },
        {
          role: "user",
          content: `Name: ${profile?.first_name || "friend"}
Birth type: ${profile?.birth_type || "unknown"}
Ate a real meal: ${answers?.ate || "—"}
Drank enough water: ${answers?.hydrated || "—"}
Rested without guilt: ${answers?.rested || "—"}
What hurts / feels off: ${answers?.pain || "—"}
Loudest emotion: ${answers?.emotion || "—"}
What she needs most before tonight: ${answers?.need || "—"}
Overall mood: ${MOOD_LABELS[moodScore] || "—"} (${moodScore}/5)`,
        },
      ],
    });

    reflection = completion.choices[0]?.message?.content?.trim() || null;

    if (reflection) {
      await supabase.from("daily_checkins")
        .update({ answers: { ...answers, _reflection: reflection } })
        .eq("user_id", user.id).eq("date", today);
    }
  } catch (err) {
    console.error("Check-in reflection failed:", err);
  }

  return Response.json({ ok: true, reflection });
}
