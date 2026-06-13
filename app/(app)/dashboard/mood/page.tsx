import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import MoodTracker from "./MoodTracker";

export default async function MoodPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let checkins: { date: string; mood_score: number; answers: Record<string, string> }[] = [];
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const { data } = await supabase
      .from("daily_checkins")
      .select("date, mood_score, answers")
      .eq("user_id", user.id)
      .gte("date", thirtyDaysAgo)
      .order("date", { ascending: true });
    checkins = data || [];
  } catch {}

  return (
    <DashboardShell userEmail={user.email}>
      <MoodTracker checkins={checkins} />
    </DashboardShell>
  );
}
