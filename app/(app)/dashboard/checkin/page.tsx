import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import CheckInClient from "./CheckInClient";

export default async function CheckInPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let profile = null;
  let todayEntry = null;
  const today = new Date().toISOString().split("T")[0];

  try {
    const { data: p } = await supabase.from("profiles").select("first_name, baby_name, phase_id").eq("user_id", user.id).single();
    profile = p;
    const { data: e } = await supabase.from("daily_checkins").select("*").eq("user_id", user.id).eq("date", today).single();
    todayEntry = e;
  } catch {}

  return (
    <DashboardShell userEmail={user.email}>
      <CheckInClient profile={profile} todayEntry={todayEntry} userId={user.id} />
    </DashboardShell>
  );
}
