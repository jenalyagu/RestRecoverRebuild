import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import TemplateLibrary from "./TemplateLibrary";

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let profile = null;
  try {
    const { data } = await supabase.from("profiles").select("first_name, baby_name, week_in_phase").eq("user_id", user.id).single();
    profile = data;
  } catch {}

  return (
    <DashboardShell userEmail={user.email}>
      <TemplateLibrary profile={profile} />
    </DashboardShell>
  );
}
