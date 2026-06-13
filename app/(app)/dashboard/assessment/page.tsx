import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import AssessmentForm from "./AssessmentForm";

export default async function AssessmentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let scores = null;
  try {
    const { data } = await supabase.from("profiles").select("village_scores").eq("user_id", user.id).single();
    scores = data?.village_scores;
  } catch {}

  return (
    <DashboardShell userEmail={user.email}>
      <AssessmentForm userId={user.id} initialScores={scores} />
    </DashboardShell>
  );
}
