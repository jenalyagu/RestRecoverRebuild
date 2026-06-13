import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Sparkles, CheckCircle2, Star } from "lucide-react";

export default async function LandingPage() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch { /* unauthenticated */ }

  return (
    <div style={{ backgroundColor: "var(--color-cream)", fontFamily: "var(--font-sans)" }}>

      {/* ─── NAV ─── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        backgroundColor: "rgba(251,247,242,0.88)",
        borderBottom: "1px solid var(--color-sand)",
      }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 1.5rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 500, color: "var(--color-charcoal)", letterSpacing: "-0.02em" }}>
            RestRecoverRebuild
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {user ? (
              <Link href="/dashboard" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.8125rem" }}>Dashboard</Link>
            ) : (
              <>
                <Link href="/login" style={{ fontSize: "0.875rem", fontWeight: 500, color: "color-mix(in srgb, var(--color-charcoal) 65%, transparent)", textDecoration: "none" }}>Sign in</Link>
                <Link href="/signup" className="btn-primary" style={{ padding: "0.5625rem 1.25rem", fontSize: "0.8125rem" }}>Get started free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: "calc(100vh - 64px)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        maxWidth: "1120px",
        margin: "0 auto",
        padding: "0 1.5rem",
        alignItems: "center",
        gap: "4rem",
        position: "relative",
      }}
        className="hero-grid">
        {/* Background glow */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-10%", right: "-5%",
            width: "700px", height: "700px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(214,63,110,0.07) 0%, transparent 65%)",
          }} />
          <div style={{
            position: "absolute", bottom: "-15%", left: "5%",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(30,22,40,0.05) 0%, transparent 65%)",
          }} />
        </div>

        {/* Left: copy */}
        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: "var(--color-rose-light)", color: "var(--color-rose)",
            borderRadius: "9999px", padding: "0.375rem 1rem",
            fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: "1.75rem",
          }}>
            <Star size={11} fill="currentColor" />
            Postpartum Recovery Companion
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif)", fontWeight: 300,
            fontSize: "clamp(3rem, 5.5vw, 4.5rem)", lineHeight: 1.04,
            letterSpacing: "-0.03em", color: "var(--color-charcoal)",
            marginBottom: "1.5rem",
          }}>
            She just built<br />a human.<br />
            <em style={{ color: "var(--color-rose)" }}>Now let&apos;s help<br />her recover.</em>
          </h1>

          <p style={{
            fontSize: "1.125rem", lineHeight: 1.7, fontWeight: 300,
            color: "color-mix(in srgb, var(--color-charcoal) 62%, transparent)",
            marginBottom: "2.25rem", maxWidth: "440px",
          }}>
            The first postpartum app powered by Claude Fable — Anthropic&apos;s most advanced AI. Week-by-week recovery plans, daily check-ins with real reflection, and village coordination built for the fourth trimester and beyond.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize: "0.9375rem", padding: "0.875rem 2rem" }}>
              Start your recovery plan
              <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="btn-secondary" style={{ fontSize: "0.9375rem", padding: "0.875rem 1.5rem" }}>
              Sign in
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {[
              "Personalized to your birth type, phase & week",
              "AI reflection after every check-in — not generic advice",
              "Village coordination that turns good intentions into real help",
            ].map(point => (
              <div key={point} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                <CheckCircle2 size={15} style={{ color: "var(--color-sage)", marginTop: "2px", flexShrink: 0 }} />
                <span style={{ fontSize: "0.8125rem", color: "color-mix(in srgb, var(--color-charcoal) 60%, transparent)" }}>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: phone mockup */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          {/* Floating badges */}
          <div style={{
            position: "absolute", top: "8%", right: "2%",
            background: "white", borderRadius: "1rem", padding: "0.875rem 1.125rem",
            boxShadow: "0 8px 32px rgba(28,23,20,0.14), 0 2px 8px rgba(28,23,20,0.08)",
            border: "1px solid var(--color-sand)", zIndex: 10,
          }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)", marginBottom: "0.25rem" }}>Recovery Score</p>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "var(--color-rose)", lineHeight: 1 }}>74<span style={{ fontSize: "1rem", color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)" }}>/100</span></p>
            <p style={{ fontSize: "0.6875rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)", marginTop: "0.25rem" }}>↑ 12 pts this week</p>
          </div>

          <div style={{
            position: "absolute", bottom: "10%", left: "0%",
            background: "white", borderRadius: "1rem", padding: "0.875rem 1.125rem",
            boxShadow: "0 8px 32px rgba(28,23,20,0.14), 0 2px 8px rgba(28,23,20,0.08)",
            border: "1px solid var(--color-sand)", zIndex: 10,
            maxWidth: "180px",
          }}>
            <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.5rem" }}>
              {["😊", "😊", "😐", "😊", "😊", "🙂", "😊"].map((e, i) => (
                <span key={i} style={{ fontSize: "0.875rem" }}>{e}</span>
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-charcoal)" }}>7-day streak</p>
            <p style={{ fontSize: "0.6875rem", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)" }}>You showed up every day</p>
          </div>

          {/* Phone */}
          <div style={{
            width: "272px", height: "556px",
            borderRadius: "44px",
            background: "var(--color-forest)",
            border: "10px solid #120d1c",
            boxShadow: "0 60px 120px rgba(18,13,28,0.5), 0 20px 40px rgba(18,13,28,0.3), 0 0 0 1px rgba(255,255,255,0.06) inset",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}>
            {/* Dynamic island */}
            <div style={{
              width: "88px", height: "26px",
              backgroundColor: "#120d1c",
              borderRadius: "0 0 20px 20px",
              margin: "0 auto",
              position: "relative", zIndex: 10,
            }} />

            {/* Screen content */}
            <div style={{ padding: "4px 16px 16px", height: "calc(100% - 26px)", display: "flex", flexDirection: "column", overflowY: "hidden" }}>
              <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(251,247,242,0.4)", marginBottom: "6px" }}>Tuesday · Week 2</p>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", fontWeight: 300, color: "rgba(251,247,242,0.95)", marginBottom: "14px", lineHeight: 1.3 }}>Evening,<br />Sarah. ✓</p>

              {/* Saved card */}
              <div style={{
                backgroundColor: "rgba(255,255,255,0.07)",
                borderRadius: "14px", padding: "12px",
                border: "1px solid rgba(255,255,255,0.08)",
                marginBottom: "10px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <Sparkles size={12} color="#D63F6E" />
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(251,247,242,0.45)" }}>A note for you</p>
                </div>
                <p style={{ fontSize: "0.72rem", lineHeight: 1.6, color: "rgba(251,247,242,0.82)" }}>
                  You&apos;re managing — and you&apos;re honest about what&apos;s hard. That matters. The overwhelm at week 2 is exactly right for where you are. Before tonight: ask one person to take the 1am feed. You don&apos;t need to word it perfectly. Just send the text.
                </p>
                <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "#D63F6E", marginTop: "8px" }}>View mood history →</p>
              </div>

              {/* Check-in mini */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  { q: "Did I eat a real meal?", a: "Kind of" },
                  { q: "Loudest emotion?", a: "Overwhelmed, but grateful" },
                  { q: "What do I need most?", a: "Someone to hold her" },
                ].map(({ q, a }) => (
                  <div key={q} style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "10px", padding: "8px 10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <p style={{ fontSize: "0.6rem", color: "rgba(251,247,242,0.4)", marginBottom: "2px" }}>{q}</p>
                    <p style={{ fontSize: "0.7rem", fontWeight: 500, color: "rgba(251,247,242,0.85)" }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Home indicator */}
            <div style={{
              position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)",
              width: "80px", height: "4px", borderRadius: "2px",
              backgroundColor: "rgba(255,255,255,0.2)",
            }} />
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* ─── THE BRUTAL TRUTH ─── */}
      <section style={{ backgroundColor: "var(--color-forest)", padding: "96px 1.5rem" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(214,63,110,0.8)", marginBottom: "3rem", textAlign: "center" }}>
            The numbers the maternity industry doesn&apos;t talk about
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
            {[
              {
                num: "1 in 5",
                sub: "new mothers experience postpartum depression or anxiety.",
                detail: "Most go undiagnosed. Most suffer alone.",
              },
              {
                num: "6 wks",
                sub: "is when medical support ends.",
                detail: "Real postpartum recovery takes 12–18 months.",
              },
              {
                num: "80%",
                sub: "of new moms felt unsupported",
                detail: "in the fourth trimester. Not a gap. A canyon.",
              },
            ].map(({ num, sub, detail }, i) => (
              <div key={num} style={{
                padding: "2.5rem",
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                textAlign: "center",
              }}>
                <p style={{
                  fontFamily: "var(--font-serif)", fontSize: "clamp(3rem, 5vw, 4.5rem)",
                  fontWeight: 300, color: "var(--color-rose)", lineHeight: 1,
                  marginBottom: "0.875rem", letterSpacing: "-0.03em",
                }}>{num}</p>
                <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "rgba(251,247,242,0.85)", marginBottom: "0.5rem", lineHeight: 1.4 }}>{sub}</p>
                <p style={{ fontSize: "0.8125rem", color: "rgba(251,247,242,0.4)", lineHeight: 1.5 }}>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE GAP ─── */}
      <section style={{ padding: "96px 1.5rem", backgroundColor: "var(--color-cream)" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p className="section-tag">The Problem</p>
          <h2 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
            fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.025em",
            color: "var(--color-charcoal)", marginBottom: "1.25rem",
          }}>
            Support ends at 6 weeks.<br />
            <em style={{ color: "var(--color-rose)" }}>Recovery takes a year.</em>
          </h2>
          <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, fontWeight: 300, color: "color-mix(in srgb, var(--color-charcoal) 60%, transparent)", marginBottom: "3.5rem", maxWidth: "600px" }}>
            The medical system checks in twice. Your body, your identity, and your mental health need support for months. This is the gap RestRecoverRebuild was built to fill.
          </p>

          {/* Timeline visualization */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "1rem", alignItems: "center" }}>
              <div />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {["Birth", "6 weeks", "3 months", "6 months", "12 months"].map(t => (
                  <span key={t} style={{ fontSize: "0.6875rem", fontWeight: 600, color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)", letterSpacing: "0.02em" }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Medical support bar */}
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "1rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)", textAlign: "right" }}>Medical support</span>
              <div style={{ position: "relative", height: "36px", backgroundColor: "var(--color-linen)", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: "12%", backgroundColor: "var(--color-sage)",
                  borderRadius: "8px", display: "flex", alignItems: "center",
                  paddingLeft: "10px",
                }}>
                  <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>2 visits</span>
                </div>
              </div>
            </div>

            {/* Your recovery bar */}
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "1rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)", textAlign: "right" }}>Your recovery</span>
              <div style={{ position: "relative", height: "36px", backgroundColor: "var(--color-linen)", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: "100%",
                  background: "linear-gradient(90deg, var(--color-rose) 0%, color-mix(in srgb, var(--color-rose) 60%, var(--color-forest)) 100%)",
                  borderRadius: "8px", display: "flex", alignItems: "center",
                  paddingLeft: "12px",
                }}>
                  <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>Physical · Emotional · Identity · Feeding · Sleep · Village — full year</span>
                </div>
              </div>
            </div>

            {/* Gap callout */}
            <div style={{
              display: "grid", gridTemplateColumns: "140px 1fr", gap: "1rem",
            }}>
              <div />
              <div style={{
                marginLeft: "12%", borderLeft: "2px solid var(--color-rose)",
                paddingLeft: "1rem",
                display: "flex", alignItems: "center",
              }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-rose)" }}>← This gap is why RestRecoverRebuild exists.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AI SHOWCASE ─── */}
      <section style={{ backgroundColor: "var(--color-forest)", padding: "96px 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              backgroundColor: "rgba(214,63,110,0.15)", borderRadius: "9999px",
              padding: "0.375rem 1rem", marginBottom: "1.5rem",
              border: "1px solid rgba(214,63,110,0.2)",
            }}>
              <Sparkles size={12} color="#D63F6E" />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#D63F6E" }}>Powered by Claude Fable</span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 300, color: "rgba(251,247,242,0.95)", lineHeight: 1.1,
              letterSpacing: "-0.025em", marginBottom: "1rem",
            }}>
              An AI that actually understands postpartum.
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.7, fontWeight: 300, color: "rgba(251,247,242,0.5)", maxWidth: "540px", margin: "0 auto" }}>
              Not generic wellness chatbot answers. A recovery companion that knows your birth type, your exact week, what you said yesterday — and gives you expert support at 2am when you need it most.
            </p>
          </div>

          {/* Conversation */}
          <div style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "24px", padding: "2rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "linear-gradient(135deg, #D63F6E 0%, #7C5CFC 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Sparkles size={15} color="white" />
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(251,247,242,0.9)" }}>Recovery AI</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(251,247,242,0.4)" }}>Claude Fable · Knows your profile · Week 2 of Fourth Trimester</p>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#22C55E" }} />
                <span style={{ fontSize: "0.6875rem", color: "rgba(251,247,242,0.4)" }}>Active</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                {
                  role: "user",
                  msg: "It's 2:47am and I can't stop crying. I don't even know why. Is something wrong with me?",
                },
                {
                  role: "ai",
                  msg: "Nothing is wrong with you. What you're describing — crying without a clear reason in the middle of the night — is one of the most common experiences in early postpartum, and it's tied directly to the hormonal shift your body is processing right now. Estrogen and progesterone drop sharply after birth. That drop affects your brain chemistry in a real, measurable way. You're not broken. You're in week 2. That said — if this feeling doesn't start to lift in the next few days, or if you're feeling detached from yourself or your baby, that's worth telling your provider. Not because something is wrong, but because you deserve support beyond midnight googling.",
                },
                {
                  role: "user",
                  msg: "My stitches still hurt at 3 weeks. My doctor said it should be fine by now.",
                },
                {
                  role: "ai",
                  msg: "Three weeks is still within the window for perineal discomfort, especially if you had a repair. Stitches dissolve between weeks 4–6, and it's common to feel tenderness, tugging, or aching until then. A warm sitz bath 2–3 times a day can help significantly. If the pain is getting worse rather than better, or you're seeing redness, warmth, or unusual discharge, that's worth a call today — not to panic, but because infection is easier to treat early. If it's just baseline aching that's gradually improving, you're on track.",
                },
              ].map(({ role, msg }, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    maxWidth: "82%",
                    backgroundColor: role === "user" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${role === "user" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
                    borderRadius: role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "1rem 1.125rem",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    color: role === "user" ? "rgba(251,247,242,0.8)" : "rgba(251,247,242,0.88)",
                  }}>
                    {msg}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8125rem", color: "rgba(251,247,242,0.3)" }}>
            Real conversation quality. Evidence-based responses. Available at 3am.
          </p>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section style={{ padding: "96px 1.5rem", backgroundColor: "var(--color-cream)" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="section-tag">Everything In One Place</p>
            <h2 style={{
              fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 300, letterSpacing: "-0.025em", color: "var(--color-charcoal)",
              lineHeight: 1.1,
            }}>
              Built for the whole recovery.<br />
              <em style={{ color: "var(--color-rose)" }}>Not just the first six weeks.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {[
              {
                icon: "✦",
                label: "Recovery Plan",
                title: "Personalized to you from day one.",
                body: "Your birth type, feeding method, challenges, and support system shape a week-by-week plan that evolves as you do. Powered by Claude Fable.",
                accent: "var(--color-rose)",
              },
              {
                icon: "◎",
                label: "Daily Check-In",
                title: "One minute. Six honest questions.",
                body: "Then a short AI reflection — written specifically for you, acknowledging exactly what you said, no toxic positivity. Your mood history builds automatically.",
                accent: "var(--color-purple)",
              },
              {
                icon: "⟡",
                label: "Village Coordination",
                title: "Turn \"let me know if you need anything\" into real help.",
                body: "Generate a task list for your support network. Share it by link. Track who's doing what — without having to manage it yourself.",
                accent: "var(--color-sage)",
              },
              {
                icon: "⊕",
                label: "Phase Guidance",
                title: "Content for exactly where you are.",
                body: "Fourth trimester, months 3–6, months 6–12 — each phase has physical, emotional, feeding, and sleep guidance tuned to that specific window.",
                accent: "var(--color-rose)",
              },
              {
                icon: "◈",
                label: "Meal Planner",
                title: "Postpartum nutrition, finally clear.",
                body: "An AI nutrition specialist designs meals for recovery, milk supply, and energy — accounting for whether you're breastfeeding, your cultural preferences, and what you actually have time to make.",
                accent: "var(--color-amber)",
              },
              {
                icon: "◇",
                label: "Recovery Hub",
                title: "Everything tracked. Nothing forgotten.",
                body: "Supplement log, baby log, feeding tracker, symptom notes — all the things you&apos;re trying to hold in your head, finally somewhere you can actually put them down.",
                accent: "var(--color-teal)",
              },
            ].map(({ icon, label, title, body, accent }) => (
              <div key={label} style={{
                backgroundColor: "white",
                borderRadius: "1.25rem",
                border: "1px solid var(--color-sand)",
                padding: "1.75rem",
                boxShadow: "var(--shadow-sm)",
                display: "flex", flexDirection: "column", gap: "0.75rem",
              }}>
                <div style={{
                  width: "40px", height: "40px",
                  backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)`,
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.125rem", color: accent,
                }}>
                  {icon}
                </div>
                <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: accent }}>{label}</p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.0625rem", fontWeight: 400, color: "var(--color-charcoal)", lineHeight: 1.3 }}>{title}</p>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "color-mix(in srgb, var(--color-charcoal) 58%, transparent)", fontWeight: 300 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PULL QUOTE ─── */}
      <section style={{ backgroundColor: "var(--color-linen)", padding: "96px 1.5rem" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", color: "var(--color-rose)", lineHeight: 0.5, marginBottom: "1.5rem", fontFamily: "Georgia, serif", opacity: 0.4 }}>&ldquo;</div>
          <p style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
            fontWeight: 300, lineHeight: 1.45, letterSpacing: "-0.02em",
            color: "var(--color-charcoal)", marginBottom: "2rem",
          }}>
            You are not just recovering from birth. You are becoming someone new. That transformation deserves more than a single follow-up appointment and a pamphlet about baby blues.
          </p>
          <div style={{ width: "40px", height: "1px", backgroundColor: "var(--color-rose)", margin: "0 auto 1.25rem" }} />
          <p style={{ fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)" }}>
            The founding principle of RestRecoverRebuild
          </p>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ padding: "1.5rem 1.5rem 4rem" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, var(--color-forest) 0%, #2D1A40 100%)",
            borderRadius: "2rem", padding: "6rem 2rem", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <div style={{
                position: "absolute", top: "-20%", right: "-10%",
                width: "600px", height: "600px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(214,63,110,0.15) 0%, transparent 65%)",
              }} />
              <div style={{
                position: "absolute", bottom: "-20%", left: "-5%",
                width: "400px", height: "400px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 65%)",
              }} />
            </div>

            <div style={{ position: "relative" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                backgroundColor: "rgba(214,63,110,0.15)",
                border: "1px solid rgba(214,63,110,0.25)",
                borderRadius: "9999px", padding: "0.375rem 1rem", marginBottom: "2rem",
              }}>
                <Star size={11} color="#D63F6E" fill="#D63F6E" />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#D63F6E" }}>Free to Start</span>
              </div>

              <h2 style={{
                fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 300, color: "rgba(251,247,242,0.97)",
                lineHeight: 1.05, letterSpacing: "-0.03em",
                marginBottom: "1.25rem",
              }}>
                She deserves more<br />than survival mode.
              </h2>
              <p style={{
                fontSize: "1.0625rem", lineHeight: 1.7, fontWeight: 300,
                color: "rgba(251,247,242,0.5)", maxWidth: "480px", margin: "0 auto 2.5rem",
              }}>
                Start your personalized recovery plan in minutes. The first postpartum app powered by the world&apos;s most advanced AI.
              </p>
              <Link href="/signup" className="btn-primary" style={{
                fontSize: "1rem", padding: "1rem 2.5rem",
                boxShadow: "0 8px 32px rgba(214,63,110,0.5), 0 2px 8px rgba(214,63,110,0.3)",
                display: "inline-flex",
              }}>
                Create your free account
                <ArrowRight size={17} />
              </Link>
              <p style={{ fontSize: "0.8125rem", color: "rgba(251,247,242,0.3)", marginTop: "1.25rem" }}>No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--color-sand)", padding: "2rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.9375rem", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)", marginBottom: "0.5rem" }}>
          &ldquo;Rest is not a reward. It is medicine.&rdquo;
        </p>
        <p style={{ fontSize: "0.8125rem", color: "color-mix(in srgb, var(--color-charcoal) 35%, transparent)" }}>
          © {new Date().getFullYear()} RestRecoverRebuild
        </p>
      </footer>
    </div>
  );
}
