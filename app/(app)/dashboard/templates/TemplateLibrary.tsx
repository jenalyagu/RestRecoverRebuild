"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface TemplateLibraryProps {
  profile: { first_name?: string; baby_name?: string; week_in_phase?: number } | null;
}

function buildTemplates(mom: string, baby: string, week: number) {
  return {
    "Setting boundaries": [
      {
        title: "Short visits only",
        text: `Hi! We're keeping visits short right now — 20–30 mins max. We'd love to see you, but food drop-offs and meal train sign-ups are what we need most. Thank you for understanding. 💛`,
      },
      {
        title: "No unannounced visits",
        text: `Please text before coming over — we're working around ${baby || "baby"}'s sleep schedule and ${mom}'s recovery. Advance notice (even an hour) makes a huge difference for us.`,
      },
      {
        title: "Come to help, not to visit",
        text: `We love you and want to see you. If you're coming over, please come ready to help — hold ${baby || "baby"}, fold laundry, or bring food. ${mom} is recovering and can't host right now. No judgment, just honesty.`,
      },
      {
        title: "Sick? Stay home.",
        text: `Quick ask — if you're feeling even a little under the weather (sniffles, sore throat, anything), please hold off on visiting. A newborn's immune system is still developing and we want to keep ${baby || "baby"} safe. We'll see you soon! 🙏`,
      },
    ],
    "Asking for help": [
      {
        title: "This week's needs",
        text: `Hey! Here's what we genuinely need this week:\n\n• A hot meal or meal delivery gift card\n• Someone to hold ${baby || "baby"} so ${mom} can sleep 2+ hours\n• Laundry help (wash + fold, no need to put away)\n\nIf any of this is possible, please let us know. We are so grateful for you.`,
      },
      {
        title: "Meal request",
        text: `Would you be open to dropping off dinner this week? Something simple is perfect — no special dietary needs. You can leave it at the door if timing is tricky. It would mean the world to us right now. 🙏`,
      },
      {
        title: "Generic ask (hard to ask for help)",
        text: `I'm learning to ask for help — which is hard for me. Here's where we're at: we're in week ${week} of the postpartum period, ${mom} is recovering, and we're running on very little sleep. If you've been wondering what to do, the answer is: a meal, an errand, or just showing up.`,
      },
      {
        title: "Night support",
        text: `Would you be willing to come over one evening and take a baby shift so ${mom} can sleep 4 consecutive hours? We're at the point where that alone would change everything. Even once would help so much.`,
      },
    ],
    "Partner communication": [
      {
        title: "What I need from you tonight",
        text: `I need to sleep. Can you take the baby from [TIME] to [TIME] so I can get a solid stretch? I'm not asking for everything — just that window. Thank you for doing this with me.`,
      },
      {
        title: "I'm not okay right now",
        text: `I want you to know: I'm not okay today. I'm not asking you to fix it. I just need you to know. Can you hold space for me — and maybe take the baby so I can cry/rest/breathe for 30 minutes?`,
      },
      {
        title: "Division of labor check-in",
        text: `Can we do a quick check-in tonight? I want to talk about how we're splitting things and what needs adjusting. I'm not complaining — I just want us to be a team on this. No blame. Just recalibrating.`,
      },
    ],
    "Medical / care team": [
      {
        title: "Requesting urgent postpartum check",
        text: `Hi, I'm postpartum (week ${week}) and I need to be seen sooner than my scheduled appointment. I'm experiencing [SYMPTOM] and I want to have it checked. Can we find time this week?`,
      },
      {
        title: "Lactation consultant referral",
        text: `I'm struggling with [feeding issue] and would love a referral to a lactation consultant. I've tried [X] but I think I need professional support. Can you help me find someone?`,
      },
      {
        title: "Pelvic floor referral",
        text: `I'd like a referral to a pelvic floor physiotherapist. I'm experiencing [leaking / pain / pressure] and I know early treatment makes a big difference. Can you help?`,
      },
    ],
  };
}

export default function TemplateLibrary({ profile }: TemplateLibraryProps) {
  const mom = profile?.first_name || "Mom";
  const baby = profile?.baby_name || "baby";
  const week = profile?.week_in_phase || 1;
  const templates = buildTemplates(mom, baby, week);
  const categories = Object.keys(templates) as (keyof typeof templates)[];

  const [activeTab, setActiveTab] = useState(categories[0]);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const CAT_COLORS: Record<string, string> = {
    "Setting boundaries": "var(--color-rose)",
    "Asking for help": "var(--color-sage)",
    "Partner communication": "var(--color-purple)",
    "Medical / care team": "var(--color-teal)",
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-light mb-2" style={{ color: "var(--color-charcoal)" }}>Text Templates</h1>
      <p className="text-sm mb-6" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>
        Copy-paste scripts for the hard conversations. Personalised for {mom} & {baby}.
      </p>

      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveTab(cat)}
            className="px-4 py-2 rounded-full text-xs font-medium transition-colors"
            style={activeTab === cat
              ? { backgroundColor: CAT_COLORS[cat] || "var(--color-rose)", color: "white" }
              : { backgroundColor: "var(--color-cream)", color: "var(--color-charcoal)", border: "1px solid var(--color-sand)" }}>
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {(templates[activeTab] || []).map((t, i) => {
          const key = `${activeTab}-${i}`;
          return (
            <div key={key} className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="font-serif text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>{t.title}</p>
                <button onClick={() => copy(t.text, key)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl shrink-0 transition-colors"
                  style={copied === key
                    ? { backgroundColor: "color-mix(in srgb, var(--color-sage) 15%, transparent)", color: "var(--color-sage)" }
                    : { backgroundColor: "color-mix(in srgb, var(--color-rose) 10%, transparent)", color: "var(--color-rose)" }}>
                  {copied === key ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "color-mix(in srgb, var(--color-charcoal) 65%, transparent)" }}>
                {t.text}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-5 rounded-2xl" style={{ backgroundColor: "color-mix(in srgb, var(--color-forest) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--color-forest) 12%, transparent)" }}>
        <p className="font-serif text-sm mb-1" style={{ color: "var(--color-charcoal)" }}>Adapt these to your voice.</p>
        <p className="text-xs leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>
          These templates are a starting point. Change the words, change the tone — the important thing is that you send them. Asking for help is not weakness. It is how the village works.
        </p>
      </div>
    </div>
  );
}
