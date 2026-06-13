"use client";

import { useState } from "react";

const TABS = ["Sleep Guide", "Solids", "Body Rebuild", "Relationships", "Identity"] as const;
type Tab = typeof TABS[number];

const CONTENT: Record<Tab, { title: string; sections: { heading: string; body: string }[] }> = {
  "Sleep Guide": {
    title: "Sleep & Rest in the Fourth Trimester",
    sections: [
      { heading: "Why sleep matters more than ever", body: "Growth hormone, immune function, and emotional regulation all depend on sleep. Postpartum sleep deprivation is real — and cumulative. Even small improvements matter enormously." },
      { heading: "Safe sleep for baby (ABCs)", body: "Alone, on their Back, in a Crib or bassinet. Keep the sleep space free of soft objects, loose bedding, and positioners. Room-sharing (not bed-sharing) reduces SIDS risk." },
      { heading: "Newborn sleep biology", body: "Newborns sleep 14–17 hours, but in 2–4 hour stretches. They don't know day from night for 6–12 weeks. Wake windows are 45–90 minutes. Overtired babies fight sleep." },
      { heading: "Protecting YOUR sleep", body: "Ask for help with at least one night feed. Sleep in the same room in shifts. Nap aggressively in the first 6 weeks — this is not laziness, it's medicine." },
      { heading: "4-month sleep regression", body: "Around 3.5–4 months, baby's sleep architecture matures to adult-like cycles. Night waking increases temporarily. Stay consistent with your routine — it does pass." },
    ],
  },
  "Solids": {
    title: "Starting Solid Foods",
    sections: [
      { heading: "When to start", body: "The WHO and AAP recommend around 6 months. Signs of readiness: sits with minimal support, shows interest in food, has lost the tongue-thrust reflex, birth weight has roughly doubled." },
      { heading: "First foods", body: "Iron-rich foods first (pureed meats, iron-fortified cereals, legumes), then a wide variety of fruits and vegetables. Single-ingredient foods let you spot allergies." },
      { heading: "Baby-led weaning", body: "BLW introduces soft, appropriately-sized finger foods from the start, letting baby self-feed. Evidence shows similar outcomes to purees. Ensure foods are soft enough to squish between fingers." },
      { heading: "Common allergens", body: "Introduce the top 9 allergens (peanuts, tree nuts, eggs, dairy, fish, shellfish, wheat, soy, sesame) early and repeatedly. Early introduction reduces allergy risk in most babies." },
      { heading: "Milk is still primary", body: "Until age 1, breast milk or formula is the primary nutrition source. Solids are for exploration, taste, and texture — not calories. Don't stress if little goes in at first." },
    ],
  },
  "Body Rebuild": {
    title: "Rebuilding Your Body Postpartum",
    sections: [
      { heading: "Diastasis recti", body: "Up to 60% of women have abdominal separation postpartum. Avoid crunches, sit-ups, or heavy lifting until cleared. Prioritise diaphragmatic breathing, gentle transverse ab engagement, and see a pelvic floor physio." },
      { heading: "Pelvic floor recovery", body: "Whether vaginal or C-section birth, your pelvic floor needs rehab. Symptoms include leaking, prolapse sensation, or pain. A pelvic floor physiotherapist can assess and guide — this should be standard care." },
      { heading: "C-section recovery", body: "Layers of tissue (skin, fascia, uterus) were cut. Avoid heavy lifting (>5kg) for 6 weeks. Scar massage after 6–8 weeks reduces adhesions. Full internal healing takes 6–12 months." },
      { heading: "When to return to exercise", body: "Light walking from week 1. Low-impact activity after 6-week clearance. Running and high-impact after 3–6 months if pelvic floor is strong. Listen to your body — leaking is a sign to slow down." },
      { heading: "Hair loss and hormones", body: "Postpartum hair shedding (telogen effluvium) peaks at 3–4 months. It is temporary. Support with postnatal vitamins, iron, and protein. Hair typically returns to baseline by 12–18 months." },
    ],
  },
  "Relationships": {
    title: "Relationships After Baby",
    sections: [
      { heading: "The partnership shift", body: "Having a baby is one of the biggest identity and relationship transitions of your life. Research shows relationship satisfaction drops significantly in the first year — this is common, not a sign of a broken relationship." },
      { heading: "Communicating needs", body: "Sleep deprivation makes both partners reactive. Try to name the need, not the frustration: \"I need 2 hours of uninterrupted sleep tonight\" vs \"You never help.\" Specific requests work better than complaints." },
      { heading: "Intimacy after birth", body: "Most providers recommend waiting 6 weeks, but this is a minimum. Desire may return much later — or not at all for months. Hormones, sleep deprivation, and breastfeeding all reduce libido. This is normal." },
      { heading: "Family and in-laws", body: "Set boundaries early and together as a couple. Decide who visits when, for how long, and what kind of help is actually helpful. A unified front reduces pressure on both of you." },
    ],
  },
  "Identity": {
    title: "Matrescence — Becoming a Mother",
    sections: [
      { heading: "What is matrescence?", body: "Matrescence (coined by anthropologist Dana Raphael) describes the profound identity shift of becoming a mother — as significant as adolescence, but far less culturally acknowledged. You are not the same person you were before." },
      { heading: "Grief is normal", body: "You can love your baby deeply and also grieve your previous life, body, freedom, or career. Both things are true. Grieving doesn't make you a bad mother." },
      { heading: "Maternal ambivalence", body: "Most mothers experience ambivalence — moments of resentment, frustration, or wishing for escape. This is universal and human. It doesn't mean you don't love your baby." },
      { heading: "Identity beyond motherhood", body: "Motherhood will change you, but you are not only a mother. Protect some space for the things that make you you — creativity, friendships, career, movement — even in tiny doses." },
      { heading: "Postpartum mood disorders", body: "1 in 5 mothers experience PPD or PPA. Symptoms lasting beyond 2 weeks, or feeling detached from your baby, warrant professional support. This is not weakness — it is biology. Please reach out." },
    ],
  },
};

export default function LearnClient() {
  const [tab, setTab] = useState<Tab>("Sleep Guide");
  const [expanded, setExpanded] = useState<number | null>(null);
  const content = CONTENT[tab];

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="font-serif text-3xl font-light mb-2" style={{ color: "var(--color-charcoal)" }}>Learn</h1>
      <p className="text-sm mb-6" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>Evidence-based guides for your recovery journey</p>

      <div className="flex gap-2 flex-wrap mb-8">
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setExpanded(null); }}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={tab === t
              ? { backgroundColor: "var(--color-purple)", color: "white" }
              : { backgroundColor: "var(--color-cream)", color: "var(--color-charcoal)", border: "1px solid var(--color-sand)" }}>
            {t}
          </button>
        ))}
      </div>

      <h2 className="font-serif text-xl font-light mb-6" style={{ color: "var(--color-charcoal)" }}>{content.title}</h2>

      <div className="space-y-3">
        {content.sections.map((s, i) => (
          <div key={i} className="card overflow-hidden">
            <button className="w-full text-left px-6 py-4 flex items-center justify-between"
              onClick={() => setExpanded(expanded === i ? null : i)}>
              <span className="font-serif text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>{s.heading}</span>
              <span className="text-lg ml-4 shrink-0" style={{ color: "var(--color-purple)" }}>{expanded === i ? "−" : "+"}</span>
            </button>
            {expanded === i && (
              <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-charcoal) 65%, transparent)" }}>
                {s.body}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
