import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { PHASES, JOURNEY_DATA } from "@/lib/data";
import type { IntakeData } from "@/types";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function client() {
  return new OpenAI({ apiKey: process.env.GROQ_API_KEY!, baseURL: "https://api.groq.com/openai/v1" });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const intake: IntakeData & { culturalTradition?: string } = body.data ?? body;

  const { error: upsertError } = await supabase.from("profiles").upsert({
    user_id: user.id,
    first_name: intake.firstName, last_name: intake.lastName,
    baby_name: intake.babyName, birth_type: intake.birthType,
    phase_id: intake.phaseId, week_in_phase: intake.weekInPhase,
    top_challenges: intake.topChallenges, support_style: intake.supportStyle,
    primary_goal: intake.primaryGoal, feeding_method: intake.feedingMethod,
    has_partner: intake.hasPartner, extended_support: intake.extendedSupport,
    cultural_tradition: intake.culturalTradition,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (upsertError) {
    console.error("Profile upsert error:", upsertError);
    return Response.json({ error: upsertError.message }, { status: 500 });
  }

  const { data: planRow } = await supabase.from("recovery_plans").insert({
    user_id: user.id, status: "generating", content: {},
    created_at: new Date().toISOString(),
  }).select().single();

  generatePlan(supabase, user.id, planRow?.id, intake).catch(console.error);
  return Response.json({ ok: true });
}

async function generatePlan(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  planId: string | undefined,
  intake: IntakeData & { culturalTradition?: string }
) {
  const phase = PHASES.find(p => p.id === intake.phaseId) || PHASES[0];
  const journeyWeeks = JOURNEY_DATA[intake.phaseId as keyof typeof JOURNEY_DATA];
  const weekIdx = Math.min((intake.weekInPhase || 1) - 1, journeyWeeks.length - 1);
  const thisWeek = journeyWeeks[weekIdx];

  const prompt = `You are a compassionate postpartum recovery specialist. Create a personalised recovery plan for:

Name: ${intake.firstName}
Baby: ${intake.babyName}
Birth type: ${intake.birthType}
Phase: ${phase.name} (${phase.range})
Week in phase: ${intake.weekInPhase}
Feeding method: ${intake.feedingMethod}
Top challenges: ${intake.topChallenges.join(", ")}
Primary goal: ${intake.primaryGoal}
Support style: ${intake.supportStyle}
Extended support: ${intake.extendedSupport}
Cultural tradition: ${intake.culturalTradition || "not specified"}
This week's focus: ${thisWeek?.title || "Early recovery"}

Return ONLY a JSON object (no markdown, no code fences):
{
  "summary": "2-3 sentence warm, personalised overview",
  "weekFocus": "what to prioritise this specific week",
  "pillars": [
    { "key": "physical", "advice": "specific advice" },
    { "key": "emotional", "advice": "specific advice" },
    { "key": "feeding", "advice": "specific advice" },
    { "key": "sleep", "advice": "specific advice" },
    { "key": "village", "advice": "specific advice" }
  ],
  "villageStrategy": "how to deploy her village this week",
  "resources": ["resource 1", "resource 2", "resource 3"],
  "affirmation": "a short, genuine affirmation (not cheesy)"
}`;

  try {
    const completion = await client().chat.completions.create({
      model: MODEL, max_tokens: 1200,
      messages: [
        { role: "system", content: "You are a compassionate, evidence-based postpartum recovery specialist. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
    });

    const text = completion.choices[0]?.message?.content || "";
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const content = JSON.parse(clean);

    if (planId) {
      await supabase.from("recovery_plans").update({ status: "ready", content }).eq("id", planId);
    } else {
      await supabase.from("recovery_plans").insert({ user_id: userId, status: "ready", content, created_at: new Date().toISOString() });
    }
  } catch (err) {
    console.error("Plan generation failed:", err);
    if (planId) await supabase.from("recovery_plans").update({ status: "failed" }).eq("id", planId);
  }
}
