"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PHASES } from "@/lib/data";

interface SettingsViewProps {
  profile: Record<string, unknown> | null;
  userEmail?: string;
}

export default function SettingsView({ profile, userEmail }: SettingsViewProps) {
  const [firstName, setFirstName] = useState(profile?.first_name as string || "");
  const [babyName, setBabyName] = useState(profile?.baby_name as string || "");
  const [phaseId, setPhaseId] = useState(profile?.phase_id as string || "p1");
  const [week, setWeek] = useState(profile?.week_in_phase as number || 1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [signoutLoading, setSignoutLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function save() {
    setSaving(true);
    try {
      await supabase.from("profiles")
        .update({ first_name: firstName, baby_name: babyName, phase_id: phaseId, week_in_phase: week })
        .eq("user_id", (profile?.user_id as string) || "");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    setSignoutLoading(true);
    await supabase.auth.signOut();
    router.push("/");
  }

  const selectedPhase = PHASES.find(p => p.id === phaseId);

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-3xl font-light mb-2" style={{ color: "var(--color-charcoal)" }}>Settings</h1>
      <p className="text-sm mb-8" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>{userEmail}</p>

      <div className="card p-6 mb-6 space-y-5">
        <h2 className="font-serif text-base" style={{ color: "var(--color-charcoal)" }}>Your details</h2>
        <div>
          <label className="label">Your first name</label>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} className="input w-full" />
        </div>
        <div>
          <label className="label">Baby's name</label>
          <input value={babyName} onChange={e => setBabyName(e.target.value)} className="input w-full" />
        </div>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-serif text-base mb-4" style={{ color: "var(--color-charcoal)" }}>Recovery phase</h2>
        <div className="space-y-2 mb-4">
          {PHASES.map(p => (
            <button key={p.id} onClick={() => { setPhaseId(p.id); setWeek(1); }}
              className="w-full text-left px-4 py-3 rounded-xl border transition-colors flex items-center justify-between"
              style={phaseId === p.id
                ? { backgroundColor: p.color, borderColor: p.tc }
                : { borderColor: "var(--color-sand)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>{p.name}</p>
                <p className="text-xs" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>{p.range}</p>
              </div>
              {phaseId === p.id && <span style={{ color: p.tc }}>✓</span>}
            </button>
          ))}
        </div>
        {selectedPhase && (
          <div>
            <label className="label">Week in phase (1–{selectedPhase.weeks})</label>
            <input type="number" min={1} max={selectedPhase.weeks} value={week}
              onChange={e => setWeek(Math.max(1, Math.min(selectedPhase.weeks, +e.target.value)))}
              className="input w-full" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-12">
        <button onClick={save} disabled={saving || saved} className="btn-primary px-8 py-3">
          {saved ? "Saved ✓" : saving ? "Saving…" : "Save changes"}
        </button>
      </div>

      <div className="border-t pt-8" style={{ borderColor: "var(--color-sand)" }}>
        <h2 className="font-serif text-base mb-2" style={{ color: "var(--color-charcoal)" }}>Account</h2>
        <button onClick={signOut} disabled={signoutLoading}
          className="text-sm px-5 py-2 rounded-xl border transition-colors"
          style={{ borderColor: "#E5E7EB", color: "#6B7280" }}>
          {signoutLoading ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );
}
