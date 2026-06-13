import OpenAI from "openai";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function client() {
  return new OpenAI({ apiKey: process.env.GROQ_API_KEY!, baseURL: "https://api.groq.com/openai/v1" });
}

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  const persona = context?.systemOverride ||
    `You are a warm, evidence-based postpartum recovery guide for RestRecoverRebuild.
You support new mothers through physical recovery, emotional wellbeing, feeding, sleep, and building their village of support.`;

  const system = `${persona}

${context?.firstName ? `The user's name is ${context.firstName}.` : ""}
${context?.phaseName ? `They are currently in ${context.phaseName} (${context.phaseRange}).` : ""}
${context?.week ? `They are in week ${context.week} of this phase.` : ""}
${context?.babyName ? `Their baby's name is ${context.babyName}.` : ""}
${context?.birthType ? `They had a ${context.birthType} birth.` : ""}
${context?.topChallenges?.length ? `Top challenges: ${context.topChallenges.join(", ")}.` : ""}

Guidelines:
- Be warm, encouraging, and non-judgmental
- Ground advice in evidence-based postpartum care
- Acknowledge that every recovery is different
- Remind them that rest is medicine, not a reward
- If they describe urgent symptoms (severe pain, heavy bleeding, suicidal thoughts), advise them to contact their healthcare provider immediately
- Keep responses concise and compassionate`;

  const stream = await client().chat.completions.create({
    model: MODEL, max_tokens: 1024, stream: true,
    messages: [{ role: "system", content: system }, ...messages],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
