"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

const QUESTIONS = [
  { key: "ate",      label: "Did I eat a real meal today?",        type: "yesno" },
  { key: "hydrated", label: "Did I drink enough water?",           type: "yesno" },
  { key: "rested",   label: "Did I rest — without guilt?",         type: "yesno" },
  { key: "pain",     label: "What hurts or feels off today?",      type: "text",  placeholder: "Stitches, back, engorged, nothing notable…" },
  { key: "emotion",  label: "What emotion is loudest right now?",  type: "text",  placeholder: "Grateful, overwhelmed, lonely, proud, numb…" },
  { key: "need",     label: "What do I need most before tonight?", type: "text",  placeholder: "Sleep, a meal, someone to hold baby, a cry…" },
  { key: "mood",     label: "Overall, how are you today?",         type: "scale" },
];

const MOODS = [
  { emoji: "😔", label: "Really hard",  score: 1 },
  { emoji: "😟", label: "Struggling",   score: 2 },
  { emoji: "😐", label: "Managing",     score: 3 },
  { emoji: "🙂", label: "Good",         score: 4 },
  { emoji: "😊", label: "Thriving",     score: 5 },
];

interface Props {
  profile: Record<string, string> | null;
  todayEntry: Record<string, unknown> | null;
  userId: string;
}

type Stage = "ritual" | "submitting" | "pause" | "reflection" | "done";

export default function CheckInClient({ profile, todayEntry, userId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>(
    (todayEntry?.answers as Record<string, string | number>) || {}
  );
  const [stage, setStage] = useState<Stage>(todayEntry ? "done" : "ritual");
  const [reflection, setReflection] = useState<string | null>(
    ((todayEntry?.answers as Record<string, string>)?._reflection as string) || null
  );
  const [visible, setVisible] = useState(true);

  const firstName = profile?.first_name || "friend";
  const total = QUESTIONS.length;
  const q = QUESTIONS[step];

  function answer(key: string, val: string | number) {
    setAnswers(a => ({ ...a, [key]: val }));
    if (q.type === "yesno" || q.type === "scale") {
      setTimeout(() => advance(), 320);
    }
  }

  function advance() {
    if (step < total - 1) {
      setVisible(false);
      setTimeout(() => { setStep(s => s + 1); setVisible(true); }, 260);
    } else {
      submit();
    }
  }

  async function submit() {
    setStage("submitting");
    const moodScore = typeof answers.mood === "number" ? answers.mood : 0;
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, answers, moodScore }),
      });
      const data = await res.json().catch(() => null);
      setStage("pause");
      setTimeout(() => {
        if (data?.reflection) {
          setReflection(data.reflection);
          setStage("reflection");
        } else {
          setStage("done");
          setTimeout(() => router.push("/dashboard/mood"), 1200);
        }
      }, 800);
    } catch {
      setStage("done");
    }
  }

  // If already done today, jump straight to reflection view
  if (stage === "done" && reflection) {
    return <ReflectionView name={firstName} reflection={reflection} onContinue={() => router.push("/dashboard/mood")} />;
  }
  if (stage === "done") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backgroundColor: "var(--color-cream)" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--color-charcoal)", marginBottom: "0.5rem" }}>Saved ✓</p>
          <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>You showed up for yourself today.</p>
        </div>
      </div>
    );
  }
  if (stage === "pause") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-forest)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.5s" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "var(--color-rose)", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (stage === "reflection") {
    return <ReflectionView name={firstName} reflection={reflection!} onContinue={() => router.push("/dashboard/mood")} />;
  }
  if (stage === "submitting") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-forest)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", color: "rgba(251,247,242,0.6)" }}>Saving…</p>
      </div>
    );
  }

  // Returning visitor — already checked in today
  if (todayEntry) {
    return <ReflectionView name={firstName} reflection={reflection} onContinue={() => router.push("/dashboard/mood")} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--color-cream)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", backgroundColor: "var(--color-sand)", zIndex: 50 }}>
        <div style={{
          height: "100%",
          backgroundColor: "var(--color-rose)",
          transition: "width 0.4s ease",
          width: `${((step + (answers[q?.key] !== undefined ? 1 : 0)) / total) * 100}%`,
        }} />
      </div>

      {/* Step counter */}
      <div style={{ position: "fixed", top: "1.25rem", right: "1.5rem", fontSize: "0.75rem", fontWeight: 600, color: "color-mix(in srgb, var(--color-charcoal) 38%, transparent)", letterSpacing: "0.08em", zIndex: 50 }}>
        {step + 1} / {total}
      </div>

      {/* Date */}
      <div style={{ position: "fixed", top: "1.25rem", left: "1.5rem", fontSize: "0.75rem", fontWeight: 600, color: "color-mix(in srgb, var(--color-charcoal) 38%, transparent)", letterSpacing: "0.06em", textTransform: "uppercase", zIndex: 50 }}>
        {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
      </div>

      {/* Main question area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 2rem 2rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.26s ease, transform 0.26s ease",
      }}>
        {step === 0 && (
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.0625rem", color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)", marginBottom: "1rem", fontStyle: "italic" }}>
            A moment for you, {firstName}.
          </p>
        )}

        <h2 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          fontWeight: 300,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          color: "var(--color-charcoal)",
          textAlign: "center",
          maxWidth: "560px",
          marginBottom: "3rem",
        }}>
          {q.label}
        </h2>

        {q.type === "yesno" && (
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            {["Yes", "Kind of", "No"].map(v => (
              <button key={v} onClick={() => answer(q.key, v)} style={{
                padding: "1rem 2.5rem",
                borderRadius: "9999px",
                border: `2px solid ${answers[q.key] === v ? "var(--color-rose)" : "var(--color-sand)"}`,
                backgroundColor: answers[q.key] === v ? "var(--color-rose)" : "white",
                color: answers[q.key] === v ? "white" : "var(--color-charcoal)",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.18s ease",
                fontFamily: "var(--font-sans)",
              }}>{v}</button>
            ))}
          </div>
        )}

        {q.type === "text" && (
          <div style={{ width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <textarea
              autoFocus
              value={(answers[q.key] as string) || ""}
              onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))}
              placeholder={q.placeholder}
              rows={3}
              style={{
                width: "100%",
                padding: "1.125rem 1.25rem",
                backgroundColor: "white",
                border: "2px solid var(--color-sand)",
                borderRadius: "1.25rem",
                fontFamily: "var(--font-sans)",
                fontSize: "1rem",
                color: "var(--color-charcoal)",
                resize: "none",
                outline: "none",
                transition: "border-color 0.2s",
                lineHeight: 1.6,
              }}
              onFocus={e => { e.target.style.borderColor = "var(--color-rose)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--color-sand)"; }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => answer(q.key, "")} style={{
                fontSize: "0.8125rem",
                color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}>
                Skip
              </button>
              <button onClick={advance} style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.75rem 1.75rem",
                backgroundColor: "var(--color-rose)", color: "white",
                border: "none", borderRadius: "9999px",
                fontSize: "0.9375rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-sans)",
              }}>
                Next <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {q.type === "scale" && (
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            {MOODS.map(m => (
              <button key={m.score} onClick={() => answer(q.key, m.score)} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: "0.5rem",
                padding: "1.25rem 1.5rem",
                borderRadius: "1.25rem",
                border: `2px solid ${answers[q.key] === m.score ? "var(--color-rose)" : "var(--color-sand)"}`,
                backgroundColor: answers[q.key] === m.score ? "color-mix(in srgb, var(--color-rose) 8%, transparent)" : "white",
                cursor: "pointer",
                transition: "all 0.18s ease",
                minWidth: "80px",
              }}>
                <span style={{ fontSize: "2rem" }}>{m.emoji}</span>
                <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>{m.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer quote */}
      <p style={{ textAlign: "center", padding: "1.5rem", fontSize: "0.75rem", fontStyle: "italic", color: "color-mix(in srgb, var(--color-charcoal) 32%, transparent)", fontFamily: "var(--font-serif)" }}>
        &ldquo;Honest answers only — this is just for you.&rdquo;
      </p>
    </div>
  );
}

function ReflectionView({ name, reflection, onContinue }: { name: string; reflection: string | null; onContinue: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 80); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--color-forest)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 2rem",
      opacity: show ? 1 : 0,
      transition: "opacity 0.6s ease",
    }}>
      <div style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "50%",
          background: "linear-gradient(135deg, var(--color-rose) 0%, #7C5CFC 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.75rem",
        }}>
          <Sparkles size={20} color="white" />
        </div>

        <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(251,247,242,0.4)", marginBottom: "0.75rem" }}>
          Check-in saved ✓
        </p>

        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", fontWeight: 300, color: "rgba(251,247,242,0.9)", marginBottom: "1.75rem" }}>
          A note for you, {name}.
        </h2>

        {reflection ? (
          <p style={{
            fontSize: "1.0625rem", lineHeight: 1.75, fontWeight: 300,
            color: "rgba(251,247,242,0.8)",
            marginBottom: "2.5rem",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
          }}>
            &ldquo;{reflection}&rdquo;
          </p>
        ) : (
          <p style={{ fontSize: "0.9375rem", color: "rgba(251,247,242,0.5)", marginBottom: "2.5rem" }}>
            You showed up for yourself today.
          </p>
        )}

        <button onClick={onContinue} style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.875rem 2rem",
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "9999px",
          color: "rgba(251,247,242,0.8)",
          fontSize: "0.875rem", fontWeight: 500,
          cursor: "pointer", fontFamily: "var(--font-sans)",
          transition: "background-color 0.2s",
        }}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.15)"; }}
          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.1)"; }}
        >
          View mood history <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
