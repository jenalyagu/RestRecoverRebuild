import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import ChatWindow from "./ChatWindow";

export default async function ChatPage() {
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
      <ChatWindow profile={profile} />
    </DashboardShell>
  );
}
