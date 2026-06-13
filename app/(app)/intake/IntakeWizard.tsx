"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { PHASES } from "@/lib/data";
import type { IntakeData } from "@/types";

const CHALLENGES = [
  "Sleep deprivation", "Postpartum mental health", "Physical recovery",
  "Breastfeeding / feeding challenges", "Partner support", "Household management",
  "Financial stress", "Social isolation", "Return to work", "Identity shift",
];

const SUPPORT_STYLES = [
  "Practical (tasks, logistics)",
  "Emotional (listening, connection)",
  "Educational (information, resources)",
  "Community (finding my village)",
];

const PRIMARY_GOALS = [
  "Survive the fourth trimester",
  "Heal my body fully",
  "Build more support around me",
  "Improve my mental health",
  "Find my new identity as a mom",
  "Thrive — not just get by",
];

const FEEDING_METHODS = ["Breastfeeding", "Formula feeding", "Combination feeding", "Pumping exclusively", "Not sure yet"];

const CULTURAL_TRADITIONS = [
  { id: "zuo-yuezi", label: "Zuo Yuezi", desc: "Chinese 'sitting the month' — warmth, rest, and family care" },
  { id: "cuarentena", label: "La Cuarentena", desc: "Latinx 40-day recovery period with community and warmth" },
  { id: "jaappa", label: "Jaappa", desc: "South Asian postpartum care with nourishing foods and massage" },
  { id: "afro-caribbean", label: "Afro-Caribbean traditions", desc: "Communal care, warming herbs, and ancestral practices" },
  { id: "middle-eastern", label: "Middle Eastern traditions", desc: "Family-centred care, specific foods, and 40-day rest" },
  { id: "indigenous", label: "Indigenous traditions", desc: "Land-based healing, ceremony, and community holding" },
  { id: "western-secular", label: "Western / secular", desc: "Evidence-based care without specific cultural framing" },
  { id: "blended", label: "Blended / multiple", desc: "Honouring more than one tradition" },
];

type StepKey = "about" | "phase" | "challenges" | "goals" | "culture";
const STEPS: StepKey[] = ["about", "phase", "challenges", "goals", "culture"];
const STEP_LABELS: Record<StepKey, string> = { about: "About You", phase: "Your Phase", challenges: "Challenges", goals: "Goals", culture: "Traditions" };

export default function IntakeWizard({ userId }: { userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [culturalTradition, setCulturalTradition] = useState("");

  const [data, setData] = useState<IntakeData>({
    firstName: "", lastName: "", partnerFirstName: "", partnerLastName: "", hasPartner: false,
    babyName: "", birthType: "vaginal", phaseId: "p1", weekInPhase: 1,
    topChallenges: [], supportStyle: "", primaryGoal: "", feedingMethod: "", complications: "", extendedSupport: "",
  });

  function updateData(partial: Partial<IntakeData>) { setData(prev => ({ ...prev, ...partial })); }
  function toggleChallenge(c: string) {
    updateData({ topChallenges: data.topChallenges.includes(c) ? data.topChallenges.filter(x => x !== c) : [...data.topChallenges, c] });
  }

  async function handleSubmit() {
    setSubmitting(true); setError("");
    const res = await fetch("/api/intake", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, data: { ...data, culturalTradition } }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong. Please try again.");
      setSubmitting(false); return;
    }
    router.push("/dashboard?onboarding=true");
    router.refresh();
  }

  const currentStep = STEPS[step];
  const selectedPhase = PHASES.find(p => p.id === data.phaseId) || PHASES[0];

  const canAdvance = () => {
    if (currentStep === "about") return !!data.firstName;
    if (currentStep === "phase") return !!data.phaseId;
    if (currentStep === "challenges") return data.topChallenges.length > 0;
    if (currentStep === "goals") return !!data.primaryGoal;
    return true;
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1 min-w-0">
            <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-all"
              style={{
                backgroundColor: i <= step ? "var(--color-rose)" : "var(--color-sand)",
                color: i <= step ? "var(--color-cream)" : "color-mix(in srgb, var(--color-charcoal) 40%, transparent)",
              }}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className="text-xs font-medium hidden sm:block truncate"
              style={{ color: i === step ? "var(--color-charcoal)" : "color-mix(in srgb, var(--color-charcoal) 40%, transparent)" }}>
              {STEP_LABELS[s]}
            </span>
            {i < STEPS.length - 1 && (
              <div className="h-px flex-1 shrink" style={{ backgroundColor: i < step ? "var(--color-rose)" : "var(--color-sand)" }} />
            )}
          </div>
        ))}
      </div>

      <div className="card p-8">
        {error && (
          <div className="text-sm px-4 py-3 rounded-xl mb-5"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-rose) 10%, transparent)", color: "var(--color-rose)" }}>
            {error}
          </div>
        )}

        {currentStep === "about" && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl" style={{ color: "var(--color-charcoal)" }}>About you</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First name *</label>
                <input className="input" placeholder="Sarah" value={data.firstName} onChange={e => updateData({ firstName: e.target.value })} />
              </div>
              <div>
                <label className="label">Last name</label>
                <input className="input" placeholder="Johnson" value={data.lastName} onChange={e => updateData({ lastName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Baby&apos;s name (optional)</label>
              <input className="input" placeholder="Oliver" value={data.babyName} onChange={e => updateData({ babyName: e.target.value })} />
            </div>
            <div>
              <label className="label">Birth type</label>
              <div className="flex gap-3">
                {(["vaginal", "c-section"] as const).map(v => (
                  <button key={v} type="button" onClick={() => updateData({ birthType: v })}
                    className="flex-1 py-3 rounded-xl border text-sm font-medium transition-all capitalize"
                    style={{
                      borderColor: data.birthType === v ? "var(--color-rose)" : "var(--color-sand)",
                      backgroundColor: data.birthType === v ? "color-mix(in srgb, var(--color-rose) 8%, transparent)" : "white",
                      color: data.birthType === v ? "var(--color-rose)" : "var(--color-charcoal)",
                    }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Feeding approach</label>
              <select className="input" value={data.feedingMethod} onChange={e => updateData({ feedingMethod: e.target.value })}>
                <option value="">Select one</option>
                {FEEDING_METHODS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"
                style={{ color: "color-mix(in srgb, var(--color-charcoal) 70%, transparent)" }}>
                <input type="checkbox" checked={data.hasPartner} onChange={e => updateData({ hasPartner: e.target.checked })} />
                I have a co-parent / partner
              </label>
            </div>
            {data.hasPartner && (
              <div className="grid grid-cols-2 gap-4 pt-3 border-t" style={{ borderColor: "var(--color-sand)" }}>
                <div>
                  <label className="label">Partner&apos;s first name</label>
                  <input className="input" placeholder="Alex" value={data.partnerFirstName || ""} onChange={e => updateData({ partnerFirstName: e.target.value })} />
                </div>
                <div>
                  <label className="label">Partner&apos;s last name</label>
                  <input className="input" placeholder="Johnson" value={data.partnerLastName || ""} onChange={e => updateData({ partnerLastName: e.target.value })} />
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === "phase" && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl" style={{ color: "var(--color-charcoal)" }}>Where are you in your journey?</h2>
            <div className="space-y-3">
              {PHASES.map(ph => (
                <button key={ph.id} onClick={() => updateData({ phaseId: ph.id, weekInPhase: 1 })}
                  className="w-full text-left px-5 py-4 rounded-xl border transition-all"
                  style={{
                    borderColor: data.phaseId === ph.id ? ph.tc : "var(--color-sand)",
                    backgroundColor: data.phaseId === ph.id ? ph.color : "white",
                  }}>
                  <p className="font-medium text-sm" style={{ color: data.phaseId === ph.id ? ph.tc : "var(--color-charcoal)" }}>{ph.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>{ph.range} · {ph.tagline}</p>
                </button>
              ))}
            </div>
            <div>
              <label className="label">Current week in phase</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {Array.from({ length: selectedPhase.weeks }, (_, i) => i + 1).map(w => (
                  <button key={w} onClick={() => updateData({ weekInPhase: w })}
                    className="w-10 h-10 rounded-xl border text-sm font-medium transition-all"
                    style={{
                      borderColor: data.weekInPhase === w ? "var(--color-rose)" : "var(--color-sand)",
                      backgroundColor: data.weekInPhase === w ? "color-mix(in srgb, var(--color-rose) 8%, transparent)" : "white",
                      color: data.weekInPhase === w ? "var(--color-rose)" : "var(--color-charcoal)",
                    }}>
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === "challenges" && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl" style={{ color: "var(--color-charcoal)" }}>What&apos;s most challenging right now?</h2>
            <p className="text-sm" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>Select all that apply.</p>
            <div className="grid grid-cols-2 gap-2">
              {CHALLENGES.map(c => {
                const selected = data.topChallenges.includes(c);
                return (
                  <button key={c} onClick={() => toggleChallenge(c)}
                    className="text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all"
                    style={{
                      borderColor: selected ? "var(--color-rose)" : "var(--color-sand)",
                      backgroundColor: selected ? "color-mix(in srgb, var(--color-rose) 8%, transparent)" : "white",
                      color: selected ? "var(--color-rose)" : "var(--color-charcoal)",
                    }}>
                    {c}
                  </button>
                );
              })}
            </div>
            <div>
              <label className="label">How do you prefer to receive support?</label>
              <div className="space-y-2">
                {SUPPORT_STYLES.map(s => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="supportStyle" value={s} checked={data.supportStyle === s} onChange={e => updateData({ supportStyle: e.target.value })} />
                    <span className="text-sm" style={{ color: "var(--color-charcoal)" }}>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === "goals" && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl" style={{ color: "var(--color-charcoal)" }}>What&apos;s your primary goal?</h2>
            <div className="space-y-2">
              {PRIMARY_GOALS.map(g => (
                <button key={g} onClick={() => updateData({ primaryGoal: g })}
                  className="w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all"
                  style={{
                    borderColor: data.primaryGoal === g ? "var(--color-rose)" : "var(--color-sand)",
                    backgroundColor: data.primaryGoal === g ? "color-mix(in srgb, var(--color-rose) 8%, transparent)" : "white",
                    color: data.primaryGoal === g ? "var(--color-rose)" : "var(--color-charcoal)",
                  }}>
                  {g}
                </button>
              ))}
            </div>
            <div>
              <label className="label">Extended family / community support</label>
              <select className="input" value={data.extendedSupport} onChange={e => updateData({ extendedSupport: e.target.value })}>
                <option value="">Select one</option>
                <option value="None — we're on our own">None — we&apos;re on our own</option>
                <option value="Some — occasional help">Some — occasional help</option>
                <option value="Nearby family — regular support">Nearby family — regular support</option>
                <option value="Strong community — lots of support">Strong community — lots of support</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === "culture" && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-2xl mb-1" style={{ color: "var(--color-charcoal)" }}>Your cultural traditions</h2>
              <p className="text-sm" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>
                Modern care, rooted in ancestral wisdom. We&apos;ll honour your traditions in your recovery plan.
              </p>
            </div>
            <div className="space-y-3">
              {CULTURAL_TRADITIONS.map(ct => (
                <button key={ct.id} onClick={() => setCulturalTradition(ct.id)}
                  className="w-full text-left px-5 py-4 rounded-xl border transition-all"
                  style={{
                    borderColor: culturalTradition === ct.id ? "var(--color-purple)" : "var(--color-sand)",
                    backgroundColor: culturalTradition === ct.id ? "color-mix(in srgb, var(--color-purple) 8%, transparent)" : "white",
                  }}>
                  <p className="font-medium text-sm" style={{ color: culturalTradition === ct.id ? "var(--color-purple)" : "var(--color-charcoal)" }}>{ct.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>{ct.desc}</p>
                </button>
              ))}
            </div>
            <p className="text-xs italic" style={{ color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)" }}>
              You can skip this and update it in settings later.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t" style={{ borderColor: "var(--color-sand)" }}>
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="btn-secondary" style={{ opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? "none" : "auto" }}>
            <ArrowLeft size={16} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="btn-primary" disabled={!canAdvance()}>
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary" disabled={submitting}>
              {submitting ? <><Spinner size="sm" /> Generating plan…</> : <>Generate my plan <ArrowRight size={16} /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
