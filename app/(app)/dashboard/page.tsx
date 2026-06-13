import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardHome from "./DashboardHome";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let profile = null;
  let plan = null;
  let dbError = false;

  const { data: p, error: profileError } = await supabase
    .from("profiles").select("*").eq("user_id", user.id).single();

  if (profileError) {
    // PGRST116 = no rows found (genuinely no profile yet)
    if (profileError.code === "PGRST116") {
      redirect("/intake");
    }
    // Any other error (network, schema cache, etc.) — show dashboard anyway
    dbError = true;
  } else {
    profile = p;
  }

  if (profile) {
    const { data: pl } = await supabase
      .from("recovery_plans").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: false }).limit(1).single();
    plan = pl;
  }

  if (!profile && !dbError) redirect("/intake");

  if (!profile) {
    return (
      <DashboardShell userEmail={user.email}>
        <div className="p-8 max-w-xl">
          <p className="font-serif text-2xl mb-2" style={{ color: "var(--color-charcoal)" }}>Setting up your dashboard…</p>
          <p className="text-sm mb-4" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>
            Your profile is being saved. Refresh in a moment if this persists.
          </p>
          <a href="/dashboard" className="btn-primary" style={{ display: "inline-flex" }}>Refresh</a>
        </div>
      </DashboardShell>
    );
  }

  // Fetch today's checkin mood and streak for the widget grid
  let todayMood: number | null = null;
  let moodStreak = 0;

  try {
    const today = new Date().toISOString().split("T")[0];
    const { data: todayCheckin } = await supabase
      .from("daily_checkins")
      .select("mood_score")
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .limit(1)
      .single();

    todayMood = todayCheckin?.mood_score ?? null;

    const { data: recentCheckins } = await supabase
      .from("daily_checkins")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (recentCheckins && recentCheckins.length > 0) {
      const checkinDays = new Set(
        recentCheckins.map((c: { created_at: string }) => new Date(c.created_at).toISOString().split("T")[0])
      );
      let streak = 0;
      const d = new Date();
      for (let i = 0; i < 30; i++) {
        const day = d.toISOString().split("T")[0];
        if (checkinDays.has(day)) {
          streak++;
          d.setDate(d.getDate() - 1);
        } else {
          break;
        }
      }
      moodStreak = streak;
    }
  } catch {
    // daily_checkins table may not exist yet
  }

  return (
    <DashboardShell userEmail={user.email}>
      <DashboardHome profile={profile} plan={plan} todayMood={todayMood} moodStreak={moodStreak} pendingVillageTasks={3} />
    </DashboardShell>
  );
}
