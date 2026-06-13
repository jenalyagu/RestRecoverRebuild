// Recovery dimensions — parallels ThriveHaus village dimensions

export type RecoveryKey = "physical" | "emotional" | "feeding" | "sleep" | "village";

export interface RecoveryDimension {
  key: RecoveryKey;
  label: string;
  description: string;
  color: string;
}

export const dimensions: RecoveryDimension[] = [
  { key: "physical", label: "Physical Recovery", description: "How your body is healing — energy, pain, pelvic floor, and movement.", color: "var(--color-rose)" },
  { key: "emotional", label: "Emotional Wellbeing", description: "Mood, anxiety, identity, and connection to yourself and others.", color: "var(--color-purple)" },
  { key: "feeding", label: "Feeding Confidence", description: "How supported and confident you feel in your feeding approach.", color: "var(--color-sage)" },
  { key: "sleep", label: "Sleep & Rest", description: "Your access to rest — yours and baby's sleep patterns.", color: "var(--color-teal, #006B5E)" },
  { key: "village", label: "Village Support", description: "How much practical and emotional support surrounds you right now.", color: "var(--color-amber, #8B5A00)" },
];

export const defaultScores: Record<RecoveryKey, number> = {
  physical: 0, emotional: 0, feeding: 0, sleep: 0, village: 0,
};

export function recoveryLabel(total: number): string {
  if (total === 0) return "Take the assessment to see your recovery score";
  if (total <= 10) return "You're in survival mode. That's okay — this phase is hard.";
  if (total <= 20) return "You're finding your footing. Keep going.";
  if (total <= 30) return "You're building momentum. Real progress happening.";
  if (total <= 40) return "You're thriving in this phase. Keep it up.";
  return "You're in full recovery flow. You're doing it.";
}
