"use client";

import { useState } from "react";
import { Plus, Check, Share2, ExternalLink, Sparkles, Heart } from "lucide-react";
import { DEFAULT_VILLAGE_TASKS } from "@/lib/data";

interface Task {
  id: string;
  text: string;
  category: string;
  assignedTo: string;
  done: boolean;
  draftMessage?: string;
  loadingDraft?: boolean;
}

const CAT_META: Record<string, { color: string; icon: string; label: string }> = {
  meals:     { color: "var(--color-rose)",   icon: "🍲", label: "Meals" },
  baby:      { color: "var(--color-sage)",   icon: "🍼", label: "Baby" },
  home:      { color: "var(--color-purple)", icon: "🏠", label: "Home" },
  errand:    { color: "var(--color-teal)",   icon: "🛒", label: "Errand" },
  emotional: { color: "var(--color-amber)",  icon: "💛", label: "Support" },
  medical:   { color: "#6B7280",             icon: "🩺", label: "Medical" },
};

const CATEGORIES = Object.keys(CAT_META);

export default function VillageClient() {
  const [tasks, setTasks] = useState<Task[]>(
    DEFAULT_VILLAGE_TASKS.map((t, i) => ({
      id: String(i),
      text: t.task,
      category: t.category,
      assignedTo: "",
      done: false,
    }))
  );
  const [newTask, setNewTask] = useState("");
  const [newCat, setNewCat] = useState("meals");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function toggle(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function addTask() {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      text: newTask.trim(),
      category: newCat,
      assignedTo: "",
      done: false,
    }]);
    setNewTask("");
  }

  function assign(id: string, name: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, assignedTo: name } : t));
  }

  async function draftMessage(id: string) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, loadingDraft: true } : t));
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Write a warm, short (2–3 sentence) personal message from a new mother asking for help with: "${task.text}". Category: ${task.category}. Make it feel like a genuine, gracious ask from a real person — not a formal request. The tone should make the recipient feel honored and specific about exactly what would help. No opening/closing formalities. Just the core message.`,
          }],
          context: {
            systemOverride: "You write warm, specific, personal request messages for new mothers asking their support network for help. Write in first person from the mother's perspective. Keep it under 3 sentences. Make the ask feel like a privilege to fulfill, not a burden.",
          },
        }),
      });
      if (!res.body) throw new Error();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let draft = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        draft += decoder.decode(value, { stream: true });
        setTasks(prev => prev.map(t => t.id === id ? { ...t, draftMessage: draft, loadingDraft: false } : t));
      }
    } catch {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, loadingDraft: false } : t));
    }
  }

  async function shareVillage() {
    setSharing(true);
    try {
      const res = await fetch("/api/village", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      const { token } = await res.json();
      const url = `${window.location.origin}/village/${token}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url).catch(() => {});
    } finally {
      setSharing(false);
    }
  }

  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  return (
    <div style={{ padding: "2rem", maxWidth: "680px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <p className="section-tag">Your support network</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "var(--color-charcoal)", letterSpacing: "-0.02em", marginBottom: "0.375rem" }}>
          Village Tasks
        </h1>
        <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>
          Turn &ldquo;let me know if you need anything&rdquo; into real, specific help.
        </p>
      </div>

      {/* Share banner */}
      {shareUrl ? (
        <div style={{
          backgroundColor: "color-mix(in srgb, var(--color-sage) 8%, transparent)",
          border: "1px solid color-mix(in srgb, var(--color-sage) 22%, transparent)",
          borderRadius: "1.25rem", padding: "1.125rem 1.25rem",
          display: "flex", alignItems: "center", gap: "1rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-charcoal)", marginBottom: "0.25rem" }}>Link copied to clipboard</p>
            <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)", wordBreak: "break-all" }}>{shareUrl}</p>
          </div>
          <a href={shareUrl} target="_blank" rel="noreferrer" style={{ color: "var(--color-sage)", flexShrink: 0 }}>
            <ExternalLink size={17} />
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
          <button onClick={shareVillage} disabled={sharing} style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            backgroundColor: "var(--color-rose)", color: "white",
            border: "none", borderRadius: "9999px",
            fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
            fontFamily: "var(--font-sans)",
            boxShadow: "0 2px 8px rgba(214,63,110,0.3)",
          }}>
            <Share2 size={14} />
            {sharing ? "Creating link…" : "Share with village"}
          </button>
        </div>
      )}

      {/* Add task */}
      <div style={{
        backgroundColor: "white", border: "1px solid var(--color-sand)",
        borderRadius: "1.25rem", padding: "1.25rem",
        marginBottom: "1.75rem", boxShadow: "var(--shadow-sm)",
      }}>
        <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)", marginBottom: "0.875rem" }}>
          Add a task
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input value={newTask} onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            placeholder="What do you need help with?"
            className="input" style={{ flex: 1, minWidth: "200px" }} />
          <select value={newCat} onChange={e => setNewCat(e.target.value)} className="input" style={{ width: "130px" }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{CAT_META[c].icon} {CAT_META[c].label}</option>)}
          </select>
          <button onClick={addTask} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.75rem 1.25rem", fontSize: "0.875rem" }}>
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {/* Category legend */}
      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {CATEGORIES.map(c => (
          <div key={c} style={{
            display: "flex", alignItems: "center", gap: "0.375rem",
            padding: "0.3rem 0.75rem",
            borderRadius: "9999px",
            backgroundColor: `color-mix(in srgb, ${CAT_META[c].color} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${CAT_META[c].color} 20%, transparent)`,
          }}>
            <span style={{ fontSize: "0.75rem" }}>{CAT_META[c].icon}</span>
            <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: CAT_META[c].color }}>{CAT_META[c].label}</span>
          </div>
        ))}
      </div>

      {/* Pending tasks as cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        {pending.map(task => {
          const meta = CAT_META[task.category] || CAT_META.meals;
          const isSelected = selectedId === task.id;
          return (
            <div key={task.id} style={{
              backgroundColor: "white",
              border: `1px solid ${isSelected ? meta.color : "var(--color-sand)"}`,
              borderRadius: "1.25rem",
              padding: "1.25rem",
              boxShadow: isSelected ? `0 4px 16px color-mix(in srgb, ${meta.color} 15%, transparent)` : "var(--shadow-sm)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                {/* Done toggle */}
                <button onClick={() => toggle(task.id)} style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  border: `2px solid ${meta.color}`,
                  backgroundColor: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0, marginTop: "1px",
                }}>
                  {task.done && <Check size={12} color={meta.color} />}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.875rem" }}>{meta.icon}</span>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: meta.color }}>{meta.label}</span>
                  </div>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--color-charcoal)", marginBottom: "0.625rem" }}>{task.text}</p>

                  {/* Assign + AI draft row */}
                  <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", alignItems: "center" }}>
                    <input
                      value={task.assignedTo}
                      onChange={e => assign(task.id, e.target.value)}
                      placeholder="Assign to…"
                      style={{
                        fontSize: "0.8125rem",
                        border: "1px solid var(--color-sand)",
                        borderRadius: "0.625rem",
                        padding: "0.375rem 0.75rem",
                        color: "var(--color-charcoal)",
                        backgroundColor: "var(--color-cream)",
                        outline: "none",
                        fontFamily: "var(--font-sans)",
                        width: "130px",
                      }}
                    />
                    <button
                      onClick={() => { setSelectedId(isSelected ? null : task.id); if (!task.draftMessage) draftMessage(task.id); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "0.375rem",
                        padding: "0.375rem 0.75rem",
                        backgroundColor: `color-mix(in srgb, ${meta.color} 10%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${meta.color} 22%, transparent)`,
                        borderRadius: "0.625rem",
                        fontSize: "0.75rem", fontWeight: 600, color: meta.color,
                        cursor: "pointer", fontFamily: "var(--font-sans)",
                      }}>
                      <Sparkles size={11} />
                      {task.loadingDraft ? "Drafting…" : task.draftMessage ? "View draft" : "AI draft"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Draft message reveal */}
              {isSelected && task.draftMessage && (
                <div style={{
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--color-sand)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
                    <Heart size={12} color={meta.color} />
                    <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: meta.color }}>
                      Suggested message
                    </p>
                  </div>
                  <p style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    color: "color-mix(in srgb, var(--color-charcoal) 70%, transparent)",
                    fontStyle: "italic",
                    backgroundColor: `color-mix(in srgb, ${meta.color} 5%, transparent)`,
                    borderRadius: "0.875rem",
                    padding: "0.875rem 1rem",
                  }}>
                    &ldquo;{task.draftMessage}&rdquo;
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)", marginTop: "0.5rem" }}>
                    Copy this into a text or share via the village link below.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pending.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)" }}>
          <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🤝</p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem" }}>All tasks complete. You have a great village.</p>
        </div>
      )}

      {/* Done */}
      {done.length > 0 && (
        <div>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 35%, transparent)", marginBottom: "0.75rem" }}>
            Done ({done.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {done.map(task => (
              <div key={task.id} style={{
                display: "flex", alignItems: "center", gap: "0.875rem",
                padding: "0.75rem 1rem", borderRadius: "1rem", opacity: 0.5,
              }}>
                <button onClick={() => toggle(task.id)} style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  backgroundColor: "var(--color-sage)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
                }}>
                  <Check size={11} color="white" />
                </button>
                <span style={{ fontSize: "0.875rem", textDecoration: "line-through", color: "var(--color-charcoal)" }}>{task.text}</span>
                {task.assignedTo && (
                  <span style={{ fontSize: "0.75rem", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)", marginLeft: "auto" }}>{task.assignedTo}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
