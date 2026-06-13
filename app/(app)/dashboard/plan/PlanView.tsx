"use client";

import Link from "next/link";
import { RefreshCw, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { PHASES } from "@/lib/data";
import { dimensions } from "@/lib/recovery";
import type { RecoveryPlanContent } from "@/types";

const PILLAR_META: Record<string, { icon: string; color: string; day: string }> = {
  physical:  { icon: "🌿", color: "var(--color-sage)",   day: "Monday" },
  emotional: { icon: "💜", color: "var(--color-purple)", day: "Tuesday" },
  feeding:   { icon: "🤱", color: "var(--color-rose)",   day: "Wednesday" },
  sleep:     { icon: "🌙", color: "var(--color-teal)",   day: "Thursday" },
  village:   { icon: "🤝", color: "var(--color-amber)",  day: "Friday" },
};

// Mon=0…Sun=6 → pillar key
const DAY_PILLAR = ["physical", "emotional", "feeding", "sleep", "village", "physical", "emotional"];

export default function PlanView({ profile, plan }: { profile: Record<string, unknown>; plan: Record<string, unknown> | null }) {
  const phase = PHASES.find(p => p.id === profile.phase_id) || PHASES[0];
  const content = plan?.content as RecoveryPlanContent | null;
  const isGenerating = plan?.status === "generating";
  const isFailed = plan?.status === "failed";

  const dayOfWeek = new Date().getDay(); // 0=Sun
  const mondayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // shift so Mon=0
  const todayPillarKey = DAY_PILLAR[mondayIndex] || "physical";
  const todayPillar = content?.pillars?.find((p: { key: string }) => p.key === todayPillarKey);
  const todayMeta = PILLAR_META[todayPillarKey];
  const otherPillars = content?.pillars?.filter((p: { key: string }) => p.key !== todayPillarKey) || [];

  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  async function regenerate() {
    await fetch("/api/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          firstName: profile.first_name, lastName: profile.last_name,
          babyName: profile.baby_name, birthType: profile.birth_type,
          phaseId: profile.phase_id, weekInPhase: profile.week_in_phase,
          topChallenges: profile.top_challenges || [],
          supportStyle: profile.support_style, primaryGoal: profile.primary_goal,
          feedingMethod: profile.feeding_method, hasPartner: profile.has_partner,
          extendedSupport: profile.extended_support, culturalTradition: profile.cultural_tradition,
        },
      }),
    });
    window.location.reload();
  }

  if (isGenerating) {
    return (
      <div style={{ padding: "2rem", maxWidth: "640px" }}>
        <div style={{
          backgroundColor: "var(--color-forest)", borderRadius: "1.5rem",
          padding: "3rem 2rem", textAlign: "center",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem", animation: "pulse 2s infinite" }}>✦</div>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 300, color: "rgba(251,247,242,0.9)", marginBottom: "0.5rem" }}>
            Building your plan…
          </p>
          <p style={{ fontSize: "0.875rem", color: "rgba(251,247,242,0.45)", marginBottom: "2rem" }}>About 15 seconds</p>
          <button onClick={() => window.location.reload()} style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "9999px", color: "rgba(251,247,242,0.8)",
            fontSize: "0.875rem", cursor: "pointer", fontFamily: "var(--font-sans)",
          }}>
            <RefreshCw size={14} /> Check now
          </button>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
      </div>
    );
  }

  if (isFailed || (!content && !isGenerating)) {
    return (
      <div style={{ padding: "2rem", maxWidth: "640px" }}>
        <div style={{ backgroundColor: "white", border: "1px solid var(--color-sand)", borderRadius: "1.5rem", padding: "3rem 2rem", textAlign: "center" }}>
          <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", color: "var(--color-charcoal)", marginBottom: "0.5rem" }}>Plan generation failed</p>
          <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)", marginBottom: "1.5rem" }}>AI temporarily unavailable</p>
          <button onClick={regenerate} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", margin: "0 auto" }}>
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div style={{ padding: "2rem", maxWidth: "640px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <p className="section-tag">{phase.name} · Week {profile.week_in_phase as number}</p>
        <button onClick={regenerate} style={{
          display: "flex", alignItems: "center", gap: "0.375rem",
          fontSize: "0.75rem", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)",
          background: "none", border: "1px solid var(--color-sand)", borderRadius: "9999px",
          padding: "0.375rem 0.875rem", cursor: "pointer", fontFamily: "var(--font-sans)",
        }}>
          <RefreshCw size={11} /> Refresh plan
        </button>
      </div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "var(--color-charcoal)", letterSpacing: "-0.02em", marginBottom: "0.375rem" }}>
        Your Recovery Plan
      </h1>
      <p style={{ fontSize: "0.8125rem", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)", marginBottom: "2rem" }}>
        Updates weekly based on your check-ins. Refreshed every Monday.
      </p>

      {/* Today's focus — hero */}
      {todayPillar && (
        <div style={{
          background: `linear-gradient(135deg, var(--color-forest) 0%, #2D1A40 100%)`,
          borderRadius: "1.5rem",
          padding: "1.75rem",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <div aria-hidden style={{
            position: "absolute", top: "-30%", right: "-10%",
            width: "240px", height: "240px", borderRadius: "50%",
            background: `radial-gradient(circle, color-mix(in srgb, ${todayMeta.color} 25%, transparent) 0%, transparent 70%)`,
          }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(251,247,242,0.4)" }}>
                {dayName}&apos;s focus
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.75rem" }}>{todayMeta.icon}</span>
              <div>
                <p style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: todayMeta.color, marginBottom: "0.125rem" }}>
                  {dimensions.find(d => d.key === todayPillarKey)?.label || todayPillarKey}
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 300, color: "rgba(251,247,242,0.95)", lineHeight: 1.2 }}>
                  One focus for today.
                </p>
              </div>
            </div>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "rgba(251,247,242,0.72)", marginBottom: "1.25rem" }}>
              {todayPillar.advice}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={12} color={todayMeta.color} />
              <span style={{ fontSize: "0.75rem", color: "rgba(251,247,242,0.4)" }}>One thing. Not everything.</span>
            </div>
          </div>
        </div>
      )}

      {/* Affirmation */}
      {content.affirmation && (
        <div style={{
          borderLeft: "3px solid var(--color-rose)",
          paddingLeft: "1.25rem",
          marginBottom: "1.5rem",
        }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontStyle: "italic", fontWeight: 300, color: "color-mix(in srgb, var(--color-charcoal) 72%, transparent)", lineHeight: 1.65 }}>
            &ldquo;{content.affirmation}&rdquo;
          </p>
        </div>
      )}

      {/* Summary */}
      {content.summary && (
        <div style={{
          backgroundColor: "white",
          border: "1px solid var(--color-sand)",
          borderRadius: "1.25rem",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "var(--shadow-sm)",
        }}>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 38%, transparent)", marginBottom: "0.625rem" }}>
            This week
          </p>
          <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "color-mix(in srgb, var(--color-charcoal) 72%, transparent)" }}>{content.summary}</p>
        </div>
      )}

      {/* Other pillars — compact */}
      {otherPillars.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 38%, transparent)", marginBottom: "0.75rem" }}>
            Rest of the week
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {otherPillars.map((pillar: { key: string; advice: string }) => {
              const meta = PILLAR_META[pillar.key];
              const dim = dimensions.find(d => d.key === pillar.key);
              return (
                <div key={pillar.key} style={{
                  backgroundColor: "white",
                  border: "1px solid var(--color-sand)",
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.875rem",
                  boxShadow: "var(--shadow-sm)",
                }}>
                  <span style={{ fontSize: "1.25rem", flexShrink: 0, marginTop: "1px" }}>{meta?.icon || "✦"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <p style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: meta?.color || "var(--color-rose)" }}>
                        {dim?.label || pillar.key}
                      </p>
                      <span style={{ fontSize: "0.6rem", color: "color-mix(in srgb, var(--color-charcoal) 35%, transparent)" }}>· {meta?.day}</span>
                    </div>
                    <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, color: "color-mix(in srgb, var(--color-charcoal) 62%, transparent)" }}>
                      {pillar.advice}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Village strategy */}
      {content.villageStrategy && (
        <div style={{
          backgroundColor: `color-mix(in srgb, var(--color-amber) 8%, transparent)`,
          border: `1px solid color-mix(in srgb, var(--color-amber) 20%, transparent)`,
          borderRadius: "1rem", padding: "1.125rem 1.25rem", marginBottom: "1rem",
        }}>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-amber)", marginBottom: "0.5rem" }}>
            🤝 Village this week
          </p>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "color-mix(in srgb, var(--color-charcoal) 65%, transparent)" }}>
            {content.villageStrategy}
          </p>
        </div>
      )}

      {/* Chat CTA */}
      <Link href="/dashboard/chat" style={{
        display: "flex", alignItems: "center", gap: "1rem",
        padding: "1rem 1.25rem",
        backgroundColor: "var(--color-charcoal)", borderRadius: "1.25rem",
        textDecoration: "none", marginTop: "0.5rem",
      }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          backgroundColor: "rgba(214,63,110,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <MessageCircle size={17} color="#F9A8C0" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(251,247,242,0.9)" }}>Questions about your plan?</p>
          <p style={{ fontSize: "0.75rem", color: "rgba(251,247,242,0.45)" }}>Ask your Recovery AI</p>
        </div>
        <ChevronRight size={16} color="rgba(251,247,242,0.3)" />
      </Link>
    </div>
  );
}
