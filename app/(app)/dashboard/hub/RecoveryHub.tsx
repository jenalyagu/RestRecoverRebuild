"use client";

import { PHASES, JOURNEY_DATA, type PhaseId } from "@/lib/data";

const SUPPLEMENT_LIST_DATA = [
  { name: "Postnatal Multivitamin",  note: "Continue at least 6 months; supports hair, mood, and energy." },
  { name: "Vitamin D3",              note: "Most postpartum women are deficient. 2,000–4,000 IU daily." },
  { name: "Omega-3 (DHA)",           note: "Supports brain recovery and mood regulation." },
  { name: "Iron",                    note: "Essential if you had significant blood loss. Check with your provider first." },
  { name: "Magnesium Glycinate",     note: "Calms the nervous system and improves sleep quality." },
  { name: "Probiotic",               note: "Especially helpful post-antibiotics or C-section to restore gut flora." },
];

const SLEEP_TIPS = [
  { title: "Sleep when baby sleeps",   body: "Your body heals during sleep. Housework can wait." },
  { title: "Ask for a night block",    body: "Ask one person to take the 1am feed so you get 4+ consecutive hours." },
  { title: "Dark, cool, quiet",        body: "Even 30-minute naps in an optimized environment compound over days." },
  { title: "Limit screens after 9pm", body: "Blue light suppresses melatonin. Dim lights signal your brain to wind down." },
];

interface Profile {
  phase_id?: string;
  week_in_phase?: number;
  first_name?: string;
  baby_name?: string;
}

export default function RecoveryHub({ profile }: { profile: Profile | null }) {
  const phaseId = (profile?.phase_id || "p1") as PhaseId;
  const weekInPhase = profile?.week_in_phase || 1;
  const phase = PHASES.find(p => p.id === phaseId) || PHASES[0];
  const journeyWeeks = JOURNEY_DATA[phaseId] || JOURNEY_DATA.p1;
  const weekIdx = Math.min(weekInPhase - 1, journeyWeeks.length - 1);
  const thisWeek = journeyWeeks[weekIdx];

  // Build "this week's issue" — curated 5 items most relevant right now
  const issueDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const issue = [
    {
      type: "lead",
      tag: "This Week",
      title: thisWeek.title,
      body: thisWeek.body,
      color: phase.tc,
    },
    {
      type: "article",
      tag: "Physical",
      title: "Your body this week",
      body: thisWeek.physical,
      icon: "🌿",
      color: "var(--color-sage)",
    },
    {
      type: "article",
      tag: "Emotional",
      title: "What you might be feeling",
      body: thisWeek.emotional,
      icon: "💜",
      color: "var(--color-purple)",
    },
    {
      type: "article",
      tag: "Feeding",
      title: "Feeding this week",
      body: thisWeek.feeding,
      icon: "🤱",
      color: "var(--color-rose)",
    },
    {
      type: "supplement",
      tag: "Wellness",
      title: "Top supplement this week",
      body: SUPPLEMENT_LIST_DATA[weekIdx % SUPPLEMENT_LIST_DATA.length].note,
      name: SUPPLEMENT_LIST_DATA[weekIdx % SUPPLEMENT_LIST_DATA.length].name,
      icon: "💊",
      color: "var(--color-teal)",
    },
    {
      type: "sleep",
      tag: "Sleep",
      title: SLEEP_TIPS[weekIdx % SLEEP_TIPS.length].title,
      body: SLEEP_TIPS[weekIdx % SLEEP_TIPS.length].body,
      icon: "🌙",
      color: "var(--color-amber)",
    },
  ];

  // Next week preview
  const nextWeekIdx = Math.min(weekIdx + 1, journeyWeeks.length - 1);
  const nextWeek = journeyWeeks[nextWeekIdx];

  return (
    <div style={{ padding: "2rem", maxWidth: "720px" }}>
      {/* Masthead */}
      <div style={{
        borderBottom: "2px solid var(--color-charcoal)",
        paddingBottom: "1rem",
        marginBottom: "2rem",
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)", marginBottom: "0.375rem" }}>
              {issueDate}
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "var(--color-charcoal)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              Recovery Hub
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: phase.tc, marginBottom: "0.25rem" }}>
              {phase.name}
            </p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 300, color: "var(--color-charcoal)", lineHeight: 1 }}>
              Week {weekInPhase}
            </p>
          </div>
        </div>
        <p style={{ fontSize: "0.8125rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)", marginTop: "0.75rem", fontStyle: "italic" }}>
          {phase.tagline} · Curated for where you are right now
        </p>
      </div>

      {/* Lead story */}
      <div style={{
        background: `linear-gradient(135deg, var(--color-forest) 0%, #2D1A40 100%)`,
        borderRadius: "1.5rem",
        padding: "2rem",
        marginBottom: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div aria-hidden style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: "280px", height: "280px", borderRadius: "50%",
          background: `radial-gradient(circle, color-mix(in srgb, ${phase.tc} 20%, transparent) 0%, transparent 70%)`,
        }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
            <div style={{
              display: "inline-flex", padding: "0.25rem 0.75rem",
              backgroundColor: `color-mix(in srgb, ${phase.tc} 20%, transparent)`,
              borderRadius: "9999px",
              fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              color: phase.tc,
            }}>
              This Week — Week {weekInPhase}
            </div>
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif)", fontSize: "1.75rem", fontWeight: 300,
            color: "rgba(251,247,242,0.95)", lineHeight: 1.2,
            letterSpacing: "-0.02em", marginBottom: "1rem",
          }}>
            {thisWeek.title}
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.75, fontWeight: 300, color: "rgba(251,247,242,0.7)" }}>
            {thisWeek.body}
          </p>
        </div>
      </div>

      {/* Article grid — 2 col on desktop */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {issue.slice(1, 5).map(item => (
          <div key={item.tag} style={{
            backgroundColor: "white",
            border: "1px solid var(--color-sand)",
            borderRadius: "1.25rem",
            padding: "1.375rem",
            borderTop: `3px solid ${item.color}`,
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.125rem" }}>{"icon" in item ? item.icon : ""}</span>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: item.color }}>
                {item.tag}
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 400, color: "var(--color-charcoal)", marginBottom: "0.5rem", lineHeight: 1.3 }}>
              {item.title}
            </h3>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "color-mix(in srgb, var(--color-charcoal) 62%, transparent)" }}>
              {"name" in item && item.name ? <><strong style={{ color: "var(--color-charcoal)" }}>{item.name}:</strong> </> : null}
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* Sleep tip */}
      <div style={{
        backgroundColor: `color-mix(in srgb, var(--color-amber) 8%, transparent)`,
        border: `1px solid color-mix(in srgb, var(--color-amber) 20%, transparent)`,
        borderRadius: "1.25rem",
        padding: "1.375rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
      }}>
        <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>🌙</span>
        <div>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-amber)", marginBottom: "0.375rem" }}>
            Sleep
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 400, color: "var(--color-charcoal)", marginBottom: "0.375rem" }}>
            {SLEEP_TIPS[weekIdx % SLEEP_TIPS.length].title}
          </p>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "color-mix(in srgb, var(--color-charcoal) 62%, transparent)" }}>
            {SLEEP_TIPS[weekIdx % SLEEP_TIPS.length].body}
          </p>
        </div>
      </div>

      {/* Next week teaser */}
      {nextWeek && nextWeekIdx !== weekIdx && (
        <div style={{
          borderTop: "1px solid var(--color-sand)",
          paddingTop: "1.5rem",
        }}>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 38%, transparent)", marginBottom: "0.75rem" }}>
            Next week
          </p>
          <div style={{
            backgroundColor: "var(--color-linen)",
            borderRadius: "1.25rem",
            padding: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              backgroundColor: "white",
              border: "1px solid var(--color-sand)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              fontFamily: "var(--font-serif)", fontWeight: 300,
              fontSize: "0.875rem",
              color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)",
            }}>
              {weekInPhase + 1}
            </div>
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-charcoal)", marginBottom: "0.25rem" }}>
                Week {weekInPhase + 1}: {nextWeek.title}
              </p>
              <p style={{ fontSize: "0.8125rem", color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)", lineHeight: 1.5 }}>
                {nextWeek.body}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Supplement note */}
      <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", backgroundColor: "white", border: "1px solid var(--color-sand)", borderRadius: "1rem", boxShadow: "var(--shadow-sm)" }}>
        <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-teal)", marginBottom: "0.75rem" }}>
          💊 Supplements to discuss with your provider
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {SUPPLEMENT_LIST_DATA.map(s => (
            <div key={s.name} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                backgroundColor: "color-mix(in srgb, var(--color-teal) 12%, transparent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: "1px",
                fontSize: "0.625rem", color: "var(--color-teal)", fontWeight: 700,
              }}>✓</div>
              <div>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-charcoal)" }}>{s.name}</span>
                <span style={{ fontSize: "0.8125rem", color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}> — {s.note}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", fontStyle: "italic", color: "color-mix(in srgb, var(--color-charcoal) 42%, transparent)", marginTop: "0.875rem" }}>
          Always check with your healthcare provider before starting supplements, especially if breastfeeding.
        </p>
      </div>
    </div>
  );
}
