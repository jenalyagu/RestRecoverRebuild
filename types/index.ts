export interface IntakeData {
  firstName: string;
  lastName: string;
  partnerFirstName?: string;
  partnerLastName?: string;
  hasPartner: boolean;
  babyName: string;
  birthType: "vaginal" | "c-section";
  phaseId: "p1" | "p2" | "p3" | "p4";
  weekInPhase: number;
  topChallenges: string[];
  supportStyle: string;
  primaryGoal: string;
  feedingMethod: string;
  complications: string;
  extendedSupport: string;
}

export interface RecoveryPlanContent {
  summary: string;
  weekFocus: string;
  pillars: {
    key: string;
    advice: string;
  }[];
  villageStrategy?: string;
  resources: string[];
  affirmation: string;
}
