"use client";

import Link from "next/link";
import { MessageCircle, CalendarCheck, Users, TrendingUp, Utensils, FileText, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import RecoveryRing from "@/components/ui/RecoveryRing";
import { dimensions, defaultScores } from "@/lib/recovery";
import { PHASES, JOURNEY_DATA } from "@/lib/data";
import type { Database } from "@/types/database";
import type { RecoveryPlanContent } from "@/types";
import type { RecoveryKey } from "@/lib/recovery";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Plan = Database["public"]["Tables"]["recovery_plans"]["Row"];

interface WidgetGridProps {
  profile: Profile;
  plan: Plan | null;
  todayMood?: number | null;
  moodStreak?: number;
  pendingVillageTasks?: number;
}

const MEAL_OF_DAY = [
  "Overnight oats with flaxseed & banana",
  "Golden milk lentil soup",
  "One-pan salmon & sweet potato",
  "Energy lactation bites",
  "Turmeric scrambled eggs on toast",
][new Date().getDay() % 5];

export default function WidgetGrid({ profile, plan, todayMood, moodStreak = 0, pendingVillageTasks = 3 }: WidgetGridProps) {
  const firstName = profile.first_name || "Friend";
  const planContent = plan?.content as RecoveryPlanContent | null;
  const isGenerating = plan?.status === "generating";

  const scores: Record<RecoveryKey, number> = {
    ...defaultScores,
    ...((profile.village_scores as Record<RecoveryKey, number> | null) || {}),
  };
  const total = Object.values(scores).reduce((a: number, b: number) => a + b, 0);

  const phase = PHASES.find(p => p.id === profile.phase_id) || PHASES[0];
  const journeyWeeks = JOURNEY_DATA[profile.phase_id as keyof typeof JOURNEY_DATA] || JOURNEY_DATA.p1;
  const weekIdx = Math.min((profile.week_in_phase || 1) - 1, journeyWeeks.length - 1);
  const thisWeek = journeyWeeks[weekIdx];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const moodEmoji = todayMood
    ? ["😔", "😕", "😐", "🙂", "😊"][todayMood - 1]
    : null;

  return (
    <div className="px-4 py-5 space-y-4 max-w-lg mx-auto">
      {/* Greeting */}
      <div className="mb-1">
        <p className="text-xs font-medium" style={{ color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)" }}>{greeting},</p>
        <h1 className="font-serif text-2xl font-light" style={{ color: "var(--color-charcoal)" }}>{firstName} 👋</h1>
        <p className="text-xs mt-0.5" style={{ color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)" }}>
          {phase.name} · Week {profile.week_in_phase || 1}{profile.baby_name ? ` · ${profile.baby_name}` : ""}
        </p>
      </div>

      {/* Phase banner — full width hero */}
      <Link href="/dashboard/plan"
        className="block rounded-2xl p-4 border-l-4 active:opacity-90 transition-opacity"
        style={{ backgroundColor: phase.color, borderLeftColor: phase.tc }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: phase.tc }}>
          {phase.range}
        </p>
        {thisWeek && (
          <p className="font-serif text-base font-light" style={{ color: "var(--color-charcoal)" }}>{thisWeek.title}</p>
        )}
        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "color-mix(in srgb, var(--color-charcoal) 60%, transparent)" }}>
          {phase.tagline} <ArrowRight size={11} />
        </p>
      </Link>

      {/* 2-col: Recovery Ring + Today's Check-in */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/assessment"
          className="card p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
          <RecoveryRing score={total} size="sm" />
          <p className="text-xs font-medium text-center" style={{ color: "var(--color-charcoal)" }}>Recovery score</p>
          <p className="text-xs" style={{ color: "var(--color-rose)" }}>{total > 0 ? "Update →" : "Take quiz →"}</p>
        </Link>

        <Link href={todayMood ? "/dashboard/mood" : "/dashboard/checkin"}
          className="card p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
          {todayMood ? (
            <>
              <span className="text-3xl">{moodEmoji}</span>
              <p className="text-xs font-medium" style={{ color: "var(--color-charcoal)" }}>Today's mood</p>
              <p className="text-xs" style={{ color: "var(--color-sage)" }}>View history →</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--color-rose) 12%, transparent)" }}>
                <CalendarCheck size={20} style={{ color: "var(--color-rose)" }} />
              </div>
              <p className="text-xs font-medium text-center" style={{ color: "var(--color-charcoal)" }}>Daily check-in</p>
              <p className="text-xs" style={{ color: "var(--color-rose)" }}>Check in now →</p>
            </>
          )}
        </Link>
      </div>

      {/* Plan affirmation — full width */}
      {planContent?.affirmation ? (
        <Link href="/dashboard/plan"
          className="block rounded-2xl p-5 active:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-forest)", color: "var(--color-cream)" }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} style={{ color: "#F9A8C0" }} />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,248,240,0.5)" }}>Recovery Plan</p>
          </div>
          <p className="font-serif text-base font-light leading-relaxed italic" style={{ color: "var(--color-cream)" }}>
            &ldquo;{planContent.affirmation}&rdquo;
          </p>
          <p className="text-xs mt-3 flex items-center gap-1" style={{ color: "#F9A8C0" }}>
            View full plan <ArrowRight size={11} />
          </p>
        </Link>
      ) : isGenerating ? (
        <div className="rounded-2xl p-5 flex items-center gap-3"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-rose) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--color-rose) 20%, transparent)" }}>
          <span className="text-xl">✦</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>Building your recovery plan…</p>
            <p className="text-xs mt-0.5" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>Hang tight, about 10 seconds</p>
          </div>
        </div>
      ) : (
        <Link href="/dashboard/plan"
          className="block rounded-2xl p-5 flex items-center gap-3 active:opacity-90"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-rose) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--color-rose) 20%, transparent)" }}>
          <Sparkles size={20} style={{ color: "var(--color-rose)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>Get your recovery plan</p>
            <p className="text-xs mt-0.5" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>Personalised to your phase &amp; challenges</p>
          </div>
        </Link>
      )}

      {/* 2-col: Village + Mood streak */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/village"
          className="card p-4 active:scale-95 transition-transform">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-rose) 12%, transparent)" }}>
            <Users size={18} style={{ color: "var(--color-rose)" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>{pendingVillageTasks} tasks</p>
          <p className="text-xs mt-0.5" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>need claiming</p>
          <p className="text-xs mt-2" style={{ color: "var(--color-rose)" }}>Village →</p>
        </Link>

        <Link href="/dashboard/mood"
          className="card p-4 active:scale-95 transition-transform">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-purple) 12%, transparent)" }}>
            <TrendingUp size={18} style={{ color: "var(--color-purple)" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>
            {moodStreak > 0 ? `${moodStreak} day streak` : "Track mood"}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>
            {moodStreak > 1 ? "🔥 Keep it up!" : "28-day chart"}
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--color-purple)" }}>Mood →</p>
        </Link>
      </div>

      {/* AI Chat — full width CTA */}
      <Link href="/dashboard/chat"
        className="block rounded-2xl p-5 flex items-center gap-4 active:scale-98 transition-transform"
        style={{ backgroundColor: "var(--color-charcoal)", color: "var(--color-cream)" }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-rose) 25%, transparent)" }}>
          <MessageCircle size={20} style={{ color: "#F9A8C0" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Ask your Recovery AI</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,248,240,0.55)" }}>Sleep, feeding, emotions, body — anything</p>
        </div>
        <ArrowRight size={18} style={{ color: "rgba(255,248,240,0.4)" }} />
      </Link>

      {/* 2-col: Meals + Templates */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/meals"
          className="card p-4 active:scale-95 transition-transform">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-amber) 12%, transparent)" }}>
            <Utensils size={18} style={{ color: "var(--color-amber)" }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "color-mix(in srgb, var(--color-amber) 80%, transparent)" }}>Meal today</p>
          <p className="text-xs font-medium leading-snug" style={{ color: "var(--color-charcoal)" }}>{MEAL_OF_DAY}</p>
          <p className="text-xs mt-2" style={{ color: "var(--color-amber)" }}>Meal plan →</p>
        </Link>

        <Link href="/dashboard/templates"
          className="card p-4 active:scale-95 transition-transform">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-teal) 12%, transparent)" }}>
            <FileText size={18} style={{ color: "var(--color-teal)" }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "color-mix(in srgb, var(--color-teal) 80%, transparent)" }}>Templates</p>
          <p className="text-xs font-medium leading-snug" style={{ color: "var(--color-charcoal)" }}>Scripts for the hard conversations</p>
          <p className="text-xs mt-2" style={{ color: "var(--color-teal)" }}>View all →</p>
        </Link>
      </div>

      {/* Shop widget — full width */}
      <Link href="/dashboard/shop"
        className="block rounded-2xl p-4 flex items-center gap-4 active:opacity-90 transition-opacity"
        style={{ backgroundColor: "color-mix(in srgb, var(--color-sage) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--color-sage) 20%, transparent)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-sage) 15%, transparent)" }}>
          🛍️
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--color-sage)" }}>Featured for {phase.name}</p>
          <p className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>Postpartum recovery essentials</p>
          <p className="text-xs mt-0.5" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>Curated picks for your phase</p>
        </div>
        <ShoppingBag size={16} style={{ color: "var(--color-sage)" }} />
      </Link>

      {/* Bottom padding for nav bar */}
      <div className="h-4" />
    </div>
  );
}
