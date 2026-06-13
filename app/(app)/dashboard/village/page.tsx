import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import VillageClient from "./VillageClient";

export default async function VillagePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return (
    <DashboardShell userEmail={user.email}>
      <VillageClient />
    </DashboardShell>
  );
}
