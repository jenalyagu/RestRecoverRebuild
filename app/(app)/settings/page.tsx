import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import SettingsView from "./SettingsView";

export default async function SettingsPage() {
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
      <SettingsView profile={profile} userEmail={user.email} />
    </DashboardShell>
  );
}
