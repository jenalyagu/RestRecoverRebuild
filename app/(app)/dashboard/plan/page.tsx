import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import PlanView from "./PlanView";

export default async function PlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let profile = null;
  let plan = null;
  try {
    const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
    profile = p;
    if (p) {
      const { data: pl } = await supabase.from("recovery_plans").select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(1).single();
      plan = pl;
    }
  } catch {}

  if (!profile) redirect("/intake");

  return (
    <DashboardShell userEmail={user.email}>
      <PlanView profile={profile} plan={plan} />
    </DashboardShell>
  );
}
