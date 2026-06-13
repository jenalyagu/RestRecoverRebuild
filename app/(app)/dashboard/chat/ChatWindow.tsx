"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { PHASES } from "@/lib/data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  profile: Record<string, unknown> | null;
}

const STARTERS = [
  "What should I expect this week in my recovery?",
  "How can I manage mastitis at home?",
  "My baby won't sleep. What can I try?",
  "How do I know if I have postpartum depression?",
  "What exercises are safe right now?",
  "How can I ask for help from my village?",
];

export default function ChatWindow({ profile }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const phase = profile?.phase_id ? PHASES.find(p => p.id === profile.phase_id) : null;

  const context = {
    firstName: profile?.first_name,
    babyName: profile?.baby_name,
    birthType: profile?.birth_type,
    phaseName: phase?.name,
    phaseRange: phase?.range,
    week: profile?.week_in_phase,
    topChallenges: profile?.top_challenges,
  };

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })), context }),
      });

      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages(m => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages(m => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: assistantText };
          return copy;
        });
      }
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-6">
      <div className="mb-4">
        <h1 className="font-serif text-2xl font-light" style={{ color: "var(--color-charcoal)" }}>Recovery AI</h1>
        <p className="text-sm" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>
          Your personal postpartum guide — ask anything
        </p>
      </div>

      {messages.length === 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)" }}>
            Suggested questions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STARTERS.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-left text-sm p-3 rounded-xl border transition-colors hover:border-current"
                style={{ borderColor: "var(--color-sand)", color: "var(--color-charcoal)", backgroundColor: "white" }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap`}
              style={m.role === "user"
                ? { backgroundColor: "var(--color-rose)", color: "white" }
                : { backgroundColor: "var(--color-cream)", color: "var(--color-charcoal)", border: "1px solid var(--color-sand)" }}>
              {m.content || (loading && i === messages.length - 1 ? <span className="animate-pulse">…</span> : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={e => { e.preventDefault(); send(input); }}
        className="flex gap-3 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Ask anything about your recovery…"
          rows={2}
          className="input flex-1 resize-none"
          style={{ minHeight: "3rem" }}
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary flex items-center gap-2 h-12">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
