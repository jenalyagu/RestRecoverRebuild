import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import { ArrowRight, Heart, Sparkles, Users } from "lucide-react";

export default async function LandingPage() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase not configured — show landing in unauthenticated state
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "var(--color-cream)" }}>
      <Navbar user={user} />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 md:py-36">
        <span className="section-tag">Postpartum Recovery Companion</span>
        <h1
          className="font-serif text-5xl md:text-7xl font-light leading-[1.1] mb-6 max-w-3xl"
          style={{ color: "var(--color-charcoal)" }}
        >
          Rest. Recover.
          <br />
          <em style={{ color: "var(--color-rose)" }}>Rebuild.</em>
        </h1>
        <p
          className="text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed"
          style={{ color: "color-mix(in srgb, var(--color-charcoal) 65%, transparent)" }}
        >
          RestRecoverRebuild is your week-by-week postpartum guide — honest, specific, and built around your actual phase. Track your recovery, coordinate your village, and get AI support exactly when you need it.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Link href="/signup" className="btn-primary text-base px-8 py-4">
            Start your recovery plan
            <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="btn-secondary text-base px-8 py-4">
            Sign in
          </Link>
        </div>
      </section>

      {/* Strip */}
      <div
        className="py-6 border-y text-center text-sm font-medium"
        style={{
          backgroundColor: "var(--color-sand)",
          borderColor: "var(--color-sand)",
          color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)",
        }}
      >
        Designed for the fourth trimester and beyond — real, honest, week by week.
      </div>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="section-tag">What RestRecoverRebuild Does</span>
          <h2 className="font-serif text-3xl md:text-4xl font-light" style={{ color: "var(--color-charcoal)" }}>
            Everything you need to actually recover
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Heart, title: "Phase-Specific Guidance", description: "Week-by-week content for the fourth trimester through your baby's first year — physical, emotional, feeding, and sleep guidance for your exact phase." },
            { icon: Sparkles, title: "AI Recovery Companion", description: "Get a personalized recovery plan and 24/7 postpartum support from an AI that knows your phase, birth type, and what you're going through." },
            { icon: Users, title: "Village Coordination", description: "Organize your support network, assign tasks to your village, track baby and supplements, and share your needs — all in one place." },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="card p-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "color-mix(in srgb, var(--color-rose) 12%, transparent)" }}>
                <Icon size={22} style={{ color: "var(--color-rose)" }} />
              </div>
              <h3 className="font-serif text-xl mb-3" style={{ color: "var(--color-charcoal)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-charcoal) 60%, transparent)" }}>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: "var(--color-forest)" }}>
        <h2 className="font-serif text-3xl md:text-4xl font-light mb-4" style={{ color: "var(--color-cream)" }}>
          You deserve support. Not just survival.
        </h2>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(255,248,240,0.65)" }}>
          Join moms already navigating postpartum recovery with RestRecoverRebuild.
        </p>
        <Link href="/signup" className="btn-primary text-base px-8 py-4">
          Create your free account
          <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="py-8 px-6 text-center text-sm border-t"
        style={{ borderColor: "var(--color-sand)", color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)" }}>
        <p className="font-serif italic mb-1">&ldquo;Rest is not a reward. It is medicine.&rdquo;</p>
        <p>© {new Date().getFullYear()} RestRecoverRebuild</p>
      </footer>
    </div>
  );
}
