"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface Task {
  id: string;
  text: string;
  category: string;
  assignedTo: string;
  done: boolean;
}

interface VillageShareViewProps {
  share: {
    tasks: Task[];
    profiles: { first_name: string; baby_name: string };
  };
  token: string;
}

const CAT_COLORS: Record<string, string> = {
  meals: "#E0457B", baby: "#0E7A47", home: "#7C5CFC",
  errand: "#006B5E", emotional: "#8B5A00", medical: "#6B7280", Food: "#E0457B",
  Baby: "#0E7A47", Home: "#7C5CFC", Errand: "#006B5E", Emotional: "#8B5A00",
  Admin: "#6B7280", Family: "#FF9800",
};

export default function VillageShareView({ share, token }: VillageShareViewProps) {
  const [tasks, setTasks] = useState<Task[]>(share.tasks || []);
  const [yourName, setYourName] = useState("");
  const [claiming, setClaiming] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const mom = share.profiles?.first_name || "your person";
  const baby = share.profiles?.baby_name;

  async function claimTask(taskId: string) {
    if (!yourName.trim()) { setClaiming(taskId); return; }
    const updated = tasks.map(t => t.id === taskId ? { ...t, assignedTo: yourName } : t);
    setTasks(updated);
    setSaved(taskId);
    setTimeout(() => setSaved(null), 2000);
    await fetch(`/api/village/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, tasks: updated }),
    });
  }

  const pending = tasks.filter(t => !t.done && !t.assignedTo);
  const claimed = tasks.filter(t => t.assignedTo);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF8F0" }}>
      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
            style={{ backgroundColor: "#FDDDE6" }}>🤝</div>
          <h1 className="font-serif text-2xl font-light mb-2" style={{ color: "#1A1523" }}>
            {mom}&apos;s Village Tasks{baby ? ` · for {baby}` : ""}
          </h1>
          <p className="text-sm" style={{ color: "color-mix(in srgb, #1A1523 55%, transparent)" }}>
            Pick something from the list below. No login needed — just claim it and show up.
          </p>
        </div>

        {/* Name entry */}
        <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: "white", border: "1px solid #F0E8F5" }}>
          <label className="text-xs font-semibold uppercase tracking-widest mb-2 block" style={{ color: "color-mix(in srgb, #1A1523 50%, transparent)" }}>
            Your name (so {mom} knows who&apos;s helping)
          </label>
          <input value={yourName} onChange={e => setYourName(e.target.value)}
            placeholder="e.g. Grandma Rosa, Auntie Diane, Marcus…"
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2"
            style={{ borderColor: "#F0E8F5", color: "#1A1523", backgroundColor: "#FFF8F0" }} />
        </div>

        {/* Pending tasks */}
        {pending.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "color-mix(in srgb, #1A1523 40%, transparent)" }}>
              Still needs help ({pending.length})
            </p>
            <div className="space-y-3">
              {pending.map(task => (
                <div key={task.id} className="rounded-2xl p-4 flex items-center gap-4"
                  style={{ backgroundColor: "white", border: "1px solid #F0E8F5" }}>
                  <div className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: `color-mix(in srgb, ${CAT_COLORS[task.category] || "#6B7280"} 20%, transparent)`, border: `2px solid ${CAT_COLORS[task.category] || "#6B7280"}` }} />
                  <p className="text-sm flex-1" style={{ color: "#1A1523" }}>{task.text}</p>
                  {claiming === task.id && !yourName && (
                    <span className="text-xs text-orange-500">Enter your name first ↑</span>
                  )}
                  <button onClick={() => claimTask(task.id)}
                    className="text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
                    style={{
                      backgroundColor: saved === task.id ? "#D4F5E2" : "color-mix(in srgb, #E0457B 10%, transparent)",
                      color: saved === task.id ? "#0E7A47" : "#E0457B",
                    }}>
                    {saved === task.id ? "Claimed ✓" : "I'll do this"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Claimed tasks */}
        {claimed.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "color-mix(in srgb, #1A1523 40%, transparent)" }}>
              Already covered ({claimed.length})
            </p>
            <div className="space-y-2">
              {claimed.map(task => (
                <div key={task.id} className="rounded-xl px-4 py-3 flex items-center gap-3 opacity-60"
                  style={{ backgroundColor: "#F0E8F5" }}>
                  <Check size={14} style={{ color: "#0E7A47" }} />
                  <p className="text-sm flex-1" style={{ color: "#1A1523" }}>{task.text}</p>
                  <span className="text-xs font-medium" style={{ color: "color-mix(in srgb, #1A1523 50%, transparent)" }}>{task.assignedTo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 && claimed.length > 0 && (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">🌸</p>
            <p className="font-serif text-base" style={{ color: "#1A1523" }}>The whole village is covered.</p>
            <p className="text-sm mt-1" style={{ color: "color-mix(in srgb, #1A1523 50%, transparent)" }}>
              {mom} is so lucky to have people like you.
            </p>
          </div>
        )}

        <p className="text-center text-xs mt-10" style={{ color: "color-mix(in srgb, #1A1523 30%, transparent)" }}>
          Powered by RestRecoverRebuild · &ldquo;The mother deserves a village.&rdquo;
        </p>
      </div>
    </div>
  );
}
