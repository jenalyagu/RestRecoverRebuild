"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle, CalendarCheck, Sparkles, Users, TrendingUp } from "lucide-react";
import type { Database } from "@/types/database";
import type { RecoveryPlanContent } from "@/types";
import type { RecoveryKey } from "@/lib/recovery";
import { dimensions, defaultScores } from "@/lib/recovery";
import { PHASES, JOURNEY_DATA } from "@/lib/data";
import WidgetGrid from "@/components/dashboard/WidgetGrid";

type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  village_scores?: Record<RecoveryKey, number>;
};
type Plan = Database["public"]["Tables"]["recovery_plans"]["Row"];

interface DashboardHomeProps {
  profile: Profile;
  plan: Plan | null;
  todayMood?: number | null;
  moodStreak?: number;
  pendingVillageTasks?: number;
}

const WEATHER_ICON: Record<number, string> = { 1: "⛈️", 2: "🌧️", 3: "⛅", 4: "🌤️", 5: "☀️" };

export default function DashboardHome({ profile, plan, todayMood, moodStreak, pendingVillageTasks }: DashboardHomeProps) {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(true);

  useEffect(() => {
    fetch("/api/morning-briefing")
      .then(r => r.json())
      .then(d => { if (d.briefing) setBriefing(d.briefing); })
      .catch(() => {})
      .finally(() => setBriefingLoading(false));
  }, []);

  const firstName = profile.first_name || "Friend";
  const planContent = plan?.content as RecoveryPlanContent | null;
  const isGenerating = plan?.status === "generating";
  const scores: Record<RecoveryKey, number> = { ...defaultScores, ...((profile.village_scores as Record<RecoveryKey, number> | null) || {}) };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const phase = PHASES.find(p => p.id === profile.phase_id) || PHASES[0];
  const journeyWeeks = JOURNEY_DATA[profile.phase_id as keyof typeof JOURNEY_DATA] || JOURNEY_DATA.p1;
  const weekIdx = Math.min((profile.week_in_phase || 1) - 1, journeyWeeks.length - 1);
  const thisWeek = journeyWeeks[weekIdx];

  const lowestDim = dimensions.reduce((a, b) => scores[a.key] < scores[b.key] ? a : b);
  const hasScores = Object.values(scores).some(v => v > 0);

  return (
    <>
      {/* Mobile: widget grid */}
      <div className="md:hidden">
        <WidgetGrid profile={profile} plan={plan} todayMood={todayMood} moodStreak={moodStreak} pendingVillageTasks={pendingVillageTasks} />
      </div>

      {/* Desktop */}
      <div className="hidden md:block" style={{ padding: "2rem", maxWidth: "900px" }}>

        {/* Morning Briefing */}
        <div style={{
          background: "linear-gradient(135deg, var(--color-forest) 0%, #2D1A40 100%)",
          borderRadius: "1.5rem",
          padding: "2rem 2.25rem",
          marginBottom: "1.75rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <div aria-hidden style={{
            position: "absolute", top: "-30%", right: "-5%",
            width: "360px", height: "360px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(214,63,110,0.12) 0%, transparent 70%)",
          }} />
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(251,247,242,0.38)", marginBottom: "0.625rem" }}>
              {greeting}
            </p>
            <h1 style={{
              fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300,
              color: "rgba(251,247,242,0.97)", letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}>
              {firstName}. <span style={{ color: phase.tc }}>Week {profile.week_in_phase || 1}.</span>
            </h1>

            {briefingLoading ? (
              <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    backgroundColor: "rgba(251,247,242,0.3)",
                    animation: `dot-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
                <style>{`@keyframes dot-pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
              </div>
            ) : briefing ? (
              <p style={{
                fontFamily: "var(--font-serif)", fontSize: "1rem",
                lineHeight: 1.75, fontStyle: "italic", fontWeight: 300,
                color: "rgba(251,247,242,0.72)",
                maxWidth: "620px",
              }}>
                {briefing}
              </p>
            ) : (
              <p style={{ fontSize: "0.9375rem", color: "rgba(251,247,242,0.5)", fontStyle: "italic" }}>
                {phase.name} · {phase.tagline}
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              {todayMood ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{WEATHER_ICON[todayMood] || "○"}</span>
                  <span style={{ fontSize: "0.8125rem", color: "rgba(251,247,242,0.55)" }}>Today&apos;s check-in logged</span>
                </div>
              ) : (
                <Link href="/dashboard/checkin" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.625rem 1.25rem",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "9999px", color: "rgba(251,247,242,0.85)",
                  fontSize: "0.8125rem", fontWeight: 500, textDecoration: "none",
                }}>
                  <CalendarCheck size={14} /> Check in today
                </Link>
              )}
              {moodStreak && moodStreak > 1 ? (
                <span style={{ fontSize: "0.8125rem", color: "rgba(251,247,242,0.45)" }}>
                  {moodStreak}-day streak 🔥
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Phase week + plan summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          {/* Phase card */}
          <div style={{
            backgroundColor: phase.color,
            borderRadius: "1.25rem",
            padding: "1.375rem",
            borderLeft: `4px solid ${phase.tc}`,
          }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: phase.tc, marginBottom: "0.5rem" }}>
              {phase.range}
            </p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.0625rem", fontWeight: 300, color: "var(--color-charcoal)", marginBottom: "0.5rem", lineHeight: 1.3 }}>
              {thisWeek?.title || phase.name}
            </p>
            <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, color: "color-mix(in srgb, var(--color-charcoal) 65%, transparent)" }}>
              {thisWeek?.body || phase.tagline}
            </p>
          </div>

          {/* Plan summary or generating */}
          {isGenerating ? (
            <div style={{
              backgroundColor: "color-mix(in srgb, var(--color-rose) 6%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-rose) 18%, transparent)",
              borderRadius: "1.25rem",
              padding: "1.375rem",
              display: "flex", alignItems: "center", gap: "1rem",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                backgroundColor: "var(--color-rose)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                animation: "pulse 2s infinite",
              }}>
                <Sparkles size={16} color="white" />
                <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-charcoal)" }}>Generating your plan…</p>
                <p style={{ fontSize: "0.8125rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>About 15 seconds</p>
              </div>
            </div>
          ) : planContent ? (
            <div style={{
              backgroundColor: "var(--color-forest)",
              borderRadius: "1.25rem",
              padding: "1.375rem",
            }}>
              <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(251,247,242,0.35)", marginBottom: "0.625rem" }}>
                Recovery Plan
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.9375rem", fontWeight: 300, color: "rgba(251,247,242,0.88)", lineHeight: 1.65, marginBottom: "0.875rem" }}>
                {planContent.summary}
              </p>
              <Link href="/dashboard/plan" style={{
                display: "inline-flex", alignItems: "center", gap: "0.375rem",
                fontSize: "0.8125rem", fontWeight: 600,
                color: "rgba(249,168,192,0.9)", textDecoration: "none",
              }}>
                View full plan <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div style={{
              backgroundColor: "white", border: "1px solid var(--color-sand)",
              borderRadius: "1.25rem", padding: "1.375rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.9375rem", color: "var(--color-charcoal)", marginBottom: "0.625rem" }}>
                  No recovery plan yet
                </p>
                <Link href="/intake" className="btn-primary" style={{ fontSize: "0.8125rem", padding: "0.5rem 1.25rem", display: "inline-flex" }}>
                  Complete intake
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recovery dimensions */}
        {hasScores && (
          <div style={{
            backgroundColor: "white", border: "1px solid var(--color-sand)",
            borderRadius: "1.25rem", padding: "1.375rem",
            marginBottom: "1.25rem", boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.125rem" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-charcoal)" }}>Recovery dimensions</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)" }}>Focus: </span>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: lowestDim.color }}>{lowestDim.label}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {dimensions.map(dim => {
                const val = scores[dim.key];
                return (
                  <div key={dim.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--color-charcoal)" }}>{dim.label}</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: dim.color }}>{val}/10</span>
                    </div>
                    <div style={{ height: "6px", borderRadius: "9999px", backgroundColor: "var(--color-linen)" }}>
                      <div style={{
                        height: "100%", borderRadius: "9999px",
                        width: `${val * 10}%`,
                        backgroundColor: dim.color,
                        transition: "width 0.7s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/dashboard/assessment" style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-rose)", textDecoration: "none", display: "inline-block", marginTop: "0.875rem" }}>
              Update assessment →
            </Link>
          </div>
        )}

        {/* Quick nav */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {[
            { href: "/dashboard/checkin", icon: <CalendarCheck size={18} />, label: "Check-In", color: "var(--color-rose)" },
            { href: "/dashboard/mood",    icon: <TrendingUp size={18} />,    label: "Mood",     color: "var(--color-purple)" },
            { href: "/dashboard/village", icon: <Users size={18} />,         label: "Village",  color: "var(--color-sage)" },
            { href: "/dashboard/chat",    icon: <MessageCircle size={18} />, label: "AI Chat",  color: "var(--color-teal)" },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              backgroundColor: "white",
              border: "1px solid var(--color-sand)",
              borderRadius: "1.125rem",
              padding: "1.125rem",
              textDecoration: "none",
              display: "flex", flexDirection: "column", gap: "0.5rem",
              boxShadow: "var(--shadow-sm)",
              transition: "box-shadow 0.2s, transform 0.15s",
            }}
              onMouseOver={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "var(--shadow-md)"; el.style.transform = "translateY(-2px)"; }}
              onMouseOut={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "var(--shadow-sm)"; el.style.transform = "translateY(0)"; }}
            >
              <div style={{
                width: "36px", height: "36px", borderRadius: "10px",
                backgroundColor: `color-mix(in srgb, ${item.color} 12%, transparent)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: item.color,
              }}>
                {item.icon}
              </div>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-charcoal)", fontFamily: "var(--font-sans)" }}>{item.label}</p>
            </Link>
          ))}
        </div>

      </div>
    </>
  );
}
