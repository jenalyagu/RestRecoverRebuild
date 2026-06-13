"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, BookOpen } from "lucide-react";

interface CheckIn {
  date: string;
  mood_score: number;
  answers: Record<string, string>;
}

const WEATHER: Record<number, { icon: string; label: string; color: string }> = {
  1: { icon: "⛈️", label: "Really hard",  color: "#6B7280" },
  2: { icon: "🌧️", label: "Struggling",   color: "#60A5FA" },
  3: { icon: "⛅",  label: "Managing",     color: "#FCD34D" },
  4: { icon: "🌤️", label: "Good",         color: "#34D399" },
  5: { icon: "☀️", label: "Thriving",     color: "#F59E0B" },
};

export default function MoodTracker({ checkins }: { checkins: CheckIn[] }) {
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loadingNarrative, setLoadingNarrative] = useState(false);
  const [narrativeError, setNarrativeError] = useState(false);

  // Build 28-day grid
  const days: { date: string; score: number | null; label: string }[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split("T")[0];
    const entry = checkins.find(c => c.date === dateStr);
    days.push({
      date: dateStr,
      score: entry?.mood_score ?? null,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    });
  }

  const today = new Date().toISOString().split("T")[0];
  const todayEntry = checkins.find(c => c.date === today);
  const avg = checkins.length
    ? Math.round(checkins.reduce((a, c) => a + c.mood_score, 0) / checkins.length * 10) / 10
    : 0;

  const streak = (() => {
    let s = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const ds = d.toISOString().split("T")[0];
      if (checkins.find(c => c.date === ds)) { s++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return s;
  })();

  async function loadNarrative() {
    setLoadingNarrative(true);
    setNarrativeError(false);
    try {
      const res = await fetch("/api/mood-narrative");
      const data = await res.json();
      if (data.narrative) setNarrative(data.narrative);
      else setNarrativeError(true);
    } catch {
      setNarrativeError(true);
    } finally {
      setLoadingNarrative(false);
    }
  }

  const last7 = [...checkins].slice(-7).reverse();

  return (
    <div style={{ padding: "2rem", maxWidth: "720px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="section-tag">Your emotional arc</p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "var(--color-charcoal)", letterSpacing: "-0.02em" }}>
            Mood Weather
          </h1>
        </div>
        <Link href="/dashboard/checkin" className="btn-primary" style={{ fontSize: "0.8125rem", padding: "0.625rem 1.25rem" }}>
          {todayEntry ? "Edit today" : "Check in today"}
        </Link>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {[
          {
            value: avg > 0 ? WEATHER[Math.round(avg)]?.icon || "—" : "—",
            label: avg > 0 ? `${avg.toFixed(1)} · ${WEATHER[Math.round(avg)]?.label || ""}` : "No data yet",
            sub: "30-day average",
          },
          {
            value: todayEntry ? WEATHER[todayEntry.mood_score]?.icon || "—" : "—",
            label: todayEntry ? WEATHER[todayEntry.mood_score]?.label || "—" : "Not logged",
            sub: "Today",
          },
          {
            value: streak > 0 ? `${streak}` : "0",
            label: streak === 1 ? "day streak" : streak > 0 ? "day streak" : "Start your streak",
            sub: "Check-in streak",
            serif: true,
          },
        ].map(({ value, label, sub, serif }) => (
          <div key={sub} style={{
            backgroundColor: "white",
            border: "1px solid var(--color-sand)",
            borderRadius: "1.25rem",
            padding: "1.25rem",
            textAlign: "center",
            boxShadow: "var(--shadow-sm)",
          }}>
            <p style={serif
              ? { fontFamily: "var(--font-serif)", fontSize: "2.25rem", fontWeight: 300, color: "var(--color-rose)", lineHeight: 1, marginBottom: "0.375rem" }
              : { fontSize: "2rem", marginBottom: "0.375rem" }}>
              {value}
            </p>
            <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-charcoal)", marginBottom: "0.25rem" }}>{label}</p>
            <p style={{ fontSize: "0.6875rem", color: "color-mix(in srgb, var(--color-charcoal) 42%, transparent)" }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Weather calendar */}
      <div style={{
        backgroundColor: "white",
        border: "1px solid var(--color-sand)",
        borderRadius: "1.25rem",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        boxShadow: "var(--shadow-sm)",
      }}>
        <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)", marginBottom: "1.25rem" }}>
          28-day weather
        </p>

        {/* Day-of-week headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "4px" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 35%, transparent)", padding: "0.25rem 0" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid — align to actual weekday */}
        <CalendarGrid days={days} today={today} />

        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--color-sand)" }}>
          {Object.entries(WEATHER).map(([score, w]) => (
            <div key={score} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <span style={{ fontSize: "0.875rem" }}>{w.icon}</span>
              <span style={{ fontSize: "0.6875rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>{w.label}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "4px", backgroundColor: "var(--color-linen)", border: "1px solid var(--color-sand)" }} />
            <span style={{ fontSize: "0.6875rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>No check-in</span>
          </div>
        </div>
      </div>

      {/* AI Narrative */}
      <div style={{
        backgroundColor: "var(--color-forest)",
        borderRadius: "1.25rem",
        padding: "1.5rem",
        marginBottom: "2rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: narrative ? "1.25rem" : "0" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-rose) 0%, #7C5CFC 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <BookOpen size={16} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(251,247,242,0.9)" }}>Your Emotional Story</p>
            <p style={{ fontSize: "0.75rem", color: "rgba(251,247,242,0.45)" }}>AI-written narrative of your last 14 days</p>
          </div>
          {!narrative && (
            <button onClick={loadNarrative} disabled={loadingNarrative || checkins.length < 3} style={{
              padding: "0.5rem 1.125rem",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "9999px",
              color: "rgba(251,247,242,0.8)",
              fontSize: "0.8125rem", fontWeight: 500,
              cursor: checkins.length < 3 ? "not-allowed" : "pointer",
              fontFamily: "var(--font-sans)",
              opacity: checkins.length < 3 ? 0.4 : 1,
              display: "flex", alignItems: "center", gap: "0.375rem",
            }}>
              <Sparkles size={13} />
              {loadingNarrative ? "Writing…" : "Read your story"}
            </button>
          )}
        </div>

        {narrative && (
          <div style={{ paddingTop: "0.25rem" }}>
            {narrative.split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontSize: "0.9375rem",
                lineHeight: 1.75,
                color: "rgba(251,247,242,0.78)",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                marginBottom: i < narrative.split("\n\n").length - 1 ? "1rem" : 0,
              }}>
                {para}
              </p>
            ))}
          </div>
        )}

        {narrativeError && (
          <p style={{ fontSize: "0.8125rem", color: "rgba(251,247,242,0.4)", marginTop: "0.5rem" }}>
            Unable to generate story right now. Try again in a moment.
          </p>
        )}

        {checkins.length < 3 && !narrative && (
          <p style={{ fontSize: "0.8125rem", color: "rgba(251,247,242,0.4)", marginTop: "0.5rem" }}>
            Check in for at least 3 days to unlock your story.
          </p>
        )}
      </div>

      {/* Recent entries */}
      {last7.length > 0 && (
        <div>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)", marginBottom: "1rem" }}>
            Recent check-ins
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {last7.map(c => {
              const w = WEATHER[c.mood_score];
              return (
                <div key={c.date} style={{
                  backgroundColor: "white",
                  border: "1px solid var(--color-sand)",
                  borderRadius: "1.25rem",
                  padding: "1.125rem 1.25rem",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "1rem",
                  alignItems: "start",
                  boxShadow: "var(--shadow-sm)",
                }}>
                  <div style={{ textAlign: "center", minWidth: "60px" }}>
                    <span style={{ fontSize: "1.75rem", display: "block" }}>{w?.icon || "○"}</span>
                    <span style={{ fontSize: "0.625rem", fontWeight: 600, color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)" }}>
                      {new Date(c.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      display: "inline-block",
                      fontSize: "0.6875rem", fontWeight: 600,
                      padding: "0.2rem 0.625rem",
                      borderRadius: "9999px",
                      backgroundColor: `color-mix(in srgb, ${w?.color || "gray"} 12%, transparent)`,
                      color: w?.color || "gray",
                      marginBottom: "0.5rem",
                    }}>
                      {w?.label || "—"}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {c.answers.emotion && (
                        <p style={{ fontSize: "0.8125rem", color: "color-mix(in srgb, var(--color-charcoal) 65%, transparent)" }}>
                          <span style={{ fontWeight: 600, color: "var(--color-charcoal)" }}>Feeling: </span>{c.answers.emotion}
                        </p>
                      )}
                      {c.answers.need && (
                        <p style={{ fontSize: "0.8125rem", color: "color-mix(in srgb, var(--color-charcoal) 65%, transparent)" }}>
                          <span style={{ fontWeight: 600, color: "var(--color-charcoal)" }}>Needed: </span>{c.answers.need}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {checkins.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌤️</p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-charcoal)", marginBottom: "0.5rem" }}>Your weather starts here</p>
          <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)", marginBottom: "1.5rem" }}>
            Check in daily and watch your emotional arc take shape.
          </p>
          <Link href="/dashboard/checkin" className="btn-primary">Start your first check-in</Link>
        </div>
      )}
    </div>
  );
}

function CalendarGrid({ days, today }: { days: { date: string; score: number | null; label: string }[]; today: string }) {
  // Find what weekday the first day falls on (0=Sun)
  const firstDayOfWeek = new Date(days[0].date + "T12:00:00").getDay();
  // Pad with empty cells
  const cells: (typeof days[0] | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...days,
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
      {cells.map((day, i) => {
        if (!day) return <div key={i} style={{ aspectRatio: "1", borderRadius: "6px" }} />;
        const w = day.score ? WEATHER[day.score] : null;
        const isToday = day.date === today;
        return (
          <div key={day.date} title={`${day.label}${w ? ` · ${w.label}` : " · No check-in"}`} style={{
            aspectRatio: "1",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1px",
            backgroundColor: isToday ? "color-mix(in srgb, var(--color-rose) 8%, transparent)" : day.score ? "var(--color-cream)" : "var(--color-linen)",
            border: isToday ? "2px solid var(--color-rose)" : "1px solid var(--color-sand)",
            cursor: "default",
          }}>
            <span style={{ fontSize: "clamp(0.75rem, 1.8vw, 1.125rem)", lineHeight: 1 }}>
              {w ? w.icon : "○"}
            </span>
            <span style={{ fontSize: "clamp(0.4rem, 0.9vw, 0.5625rem)", color: "color-mix(in srgb, var(--color-charcoal) 38%, transparent)", fontWeight: 500 }}>
              {new Date(day.date + "T12:00:00").getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
