import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import RecoveryHub from "./RecoveryHub";

export default async function HubPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let profile = null;
  try {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
    profile = data;
  } catch {}

  return (
    <DashboardShell userEmail={user.email}>
      <RecoveryHub profile={profile} />
    </DashboardShell>
  );
}
