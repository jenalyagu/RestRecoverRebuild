"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { dimensions, defaultScores } from "@/lib/recovery";
import type { RecoveryKey } from "@/lib/recovery";

interface AssessmentFormProps {
  userId: string;
  initialScores: Record<RecoveryKey, number> | null;
}

const QUESTIONS: Record<RecoveryKey, string> = {
  physical: "How is your body feeling? (pain, healing, energy)",
  emotional: "How are you feeling emotionally? (mood, anxiety, support)",
  feeding: "How confident do you feel about feeding your baby?",
  sleep: "How would you rate your rest and sleep quality?",
  village: "How supported do you feel by the people around you?",
};

export default function AssessmentForm({ userId, initialScores }: AssessmentFormProps) {
  const [scores, setScores] = useState<Record<RecoveryKey, number>>(
    initialScores || { ...defaultScores }
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function save() {
    setSaving(true);
    try {
      await supabase.from("profiles").update({ village_scores: scores }).eq("user_id", userId);
      setSaved(true);
      setTimeout(() => router.push("/dashboard"), 1000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-3xl font-light mb-2" style={{ color: "var(--color-charcoal)" }}>Recovery Assessment</h1>
      <p className="text-sm mb-8" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>
        Rate each dimension from 1 (struggling) to 10 (thriving). Be honest — this is just for you.
      </p>

      <div className="space-y-8">
        {dimensions.map(dim => {
          const val = scores[dim.key];
          return (
            <div key={dim.key} className="card p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="font-serif text-base font-medium" style={{ color: "var(--color-charcoal)" }}>{dim.label}</h2>
                  <p className="text-sm mt-0.5" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>{QUESTIONS[dim.key]}</p>
                </div>
                <span className="text-2xl font-bold font-serif ml-4 shrink-0" style={{ color: dim.color }}>{val}</span>
              </div>
              <input
                type="range" min={0} max={10} value={val}
                onChange={e => setScores(s => ({ ...s, [dim.key]: +e.target.value }))}
                className="w-full mt-3 accent-rose-400"
                style={{ accentColor: dim.color }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: "color-mix(in srgb, var(--color-charcoal) 35%, transparent)" }}>
                <span>Struggling</span><span>Thriving</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button onClick={save} disabled={saving || saved} className="btn-primary px-8 py-3">
          {saved ? "Saved! ✓" : saving ? "Saving…" : "Save assessment"}
        </button>
        <button onClick={() => router.push("/dashboard")} className="text-sm" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
