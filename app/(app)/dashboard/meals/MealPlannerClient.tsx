"use client";

import { useState } from "react";
import { Sparkles, Moon, ShoppingBag } from "lucide-react";

type Mode = "plan" | "fridge" | "2am";

const RESTRICTIONS = ["Dairy-free", "Gluten-free", "Nut-free", "Vegetarian", "Vegan", "Low sugar"];
const GOALS = ["Boost milk supply", "Reduce inflammation", "Increase energy", "Support mood", "Fast to prepare"];

const SAMPLE_MEALS = [
  { name: "Postpartum Oat Bowl",     tags: ["breakfast", "lactation"],        desc: "Overnight oats with flaxseed, banana, and almond butter — a milk-supply staple." },
  { name: "Golden Milk Lentil Soup", tags: ["lunch", "anti-inflammatory"],    desc: "Red lentils, turmeric, coconut milk, and spinach. Freezes beautifully." },
  { name: "One-Pan Salmon & Veg",    tags: ["dinner", "omega-3"],             desc: "Sheet pan salmon with sweet potato and broccoli. Ready in 25 minutes." },
  { name: "Lactation Energy Bites",  tags: ["snack", "one-handed"],           desc: "No-bake oat, honey, dark chocolate, and brewer's yeast bites." },
  { name: "Greek Yoghurt Parfait",   tags: ["snack", "protein"],              desc: "Full-fat Greek yoghurt, honey, walnuts. One hand, no prep." },
  { name: "Chicken Bone Broth Soup", tags: ["lunch", "healing"],              desc: "Gut-healing, collagen-rich. Made ahead, reheated in 3 minutes." },
];

async function streamChat(prompt: string, systemOverride: string, onChunk: (t: string) => void) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      context: { systemOverride },
    }),
  });
  if (!res.body) throw new Error("No stream");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}

export default function MealPlannerClient() {
  const [mode, setMode] = useState<Mode>("plan");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [fridgeIngredients, setFridgeIngredients] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  function toggle(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  }

  async function generate() {
    setLoading(true);
    setResult("");
    try {
      const system = "You are a postpartum nutrition specialist. Recommend meals that support healing, hormone balance, milk production, and sustained energy. Prioritize easy prep, one-handed eating, and freezer-friendly options. Be specific and practical.";

      let prompt = "";
      if (mode === "plan") {
        prompt = `Create a 3-meal + 2-snack postpartum meal plan for today.
${restrictions.length ? `Dietary restrictions: ${restrictions.join(", ")}.` : "No specific restrictions."}
${goals.length ? `Goals: ${goals.join(", ")}.` : ""}
Format: meal name, 2-line ingredients summary, one prep note. Keep it practical and realistic for someone exhausted with a newborn.`;
      } else if (mode === "fridge") {
        prompt = `I have these ingredients available right now: ${fridgeIngredients || "oats, eggs, banana, Greek yoghurt, bread, peanut butter"}.
Create 2–3 postpartum-optimized meal or snack ideas using only these ingredients.
Each should: support milk supply or healing if possible, be quick to prepare, ideally one-handed.
Name each meal, list exactly which ingredients you're using, and give a 1-sentence prep note.`;
      } else {
        prompt = `It's the middle of the night. I'm feeding my baby and I need a snack I can eat RIGHT NOW that:
- I can make and eat with one hand
- Takes under 2 minutes
- Won't require turning on bright lights
- Ideally supports milk supply
Give me 3 specific snack options with exactly what to grab and a one-sentence note on why it helps.`;
      }

      await streamChat(prompt, system, chunk => setResult(r => r + chunk));
    } catch {
      setResult("Unable to generate right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const modes: { key: Mode; icon: React.ReactNode; label: string; desc: string }[] = [
    { key: "plan",   icon: <Sparkles size={15} />, label: "Build a plan",     desc: "Full day of meals" },
    { key: "fridge", icon: <ShoppingBag size={15} />, label: "What's in my fridge?", desc: "Use what you have" },
    { key: "2am",    icon: <Moon size={15} />,     label: "2am snack",        desc: "One-handed, right now" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "720px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p className="section-tag">The Healing Kitchen</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 300, color: "var(--color-charcoal)", letterSpacing: "-0.02em" }}>
          Meal Planner
        </h1>
        <p style={{ fontSize: "0.875rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)", marginTop: "0.375rem" }}>
          Postpartum nutrition, finally practical.
        </p>
      </div>

      {/* Mode selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginBottom: "2rem" }}>
        {modes.map(m => (
          <button key={m.key} onClick={() => { setMode(m.key); setResult(""); }} style={{
            padding: "1rem",
            borderRadius: "1.25rem",
            border: `2px solid ${mode === m.key ? "var(--color-rose)" : "var(--color-sand)"}`,
            backgroundColor: mode === m.key ? "color-mix(in srgb, var(--color-rose) 6%, transparent)" : "white",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.18s ease",
            boxShadow: mode === m.key ? "0 0 0 3px rgba(214,63,110,0.1)" : "var(--shadow-sm)",
          }}>
            <div style={{ color: mode === m.key ? "var(--color-rose)" : "color-mix(in srgb, var(--color-charcoal) 50%, transparent)", marginBottom: "0.5rem" }}>
              {m.icon}
            </div>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-charcoal)", marginBottom: "0.2rem", fontFamily: "var(--font-sans)" }}>
              {m.label}
            </p>
            <p style={{ fontSize: "0.75rem", color: "color-mix(in srgb, var(--color-charcoal) 45%, transparent)" }}>
              {m.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Mode content */}
      <div style={{
        backgroundColor: "white", border: "1px solid var(--color-sand)",
        borderRadius: "1.25rem", padding: "1.5rem",
        marginBottom: "1.5rem", boxShadow: "var(--shadow-sm)",
      }}>
        {mode === "plan" && (
          <>
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)", marginBottom: "0.75rem" }}>
                Dietary restrictions
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {RESTRICTIONS.map(r => (
                  <button key={r} onClick={() => toggle(restrictions, setRestrictions, r)} style={{
                    padding: "0.4rem 0.875rem", borderRadius: "9999px",
                    border: `1.5px solid ${restrictions.includes(r) ? "var(--color-rose)" : "var(--color-sand)"}`,
                    backgroundColor: restrictions.includes(r) ? "var(--color-rose)" : "transparent",
                    color: restrictions.includes(r) ? "white" : "var(--color-charcoal)",
                    fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}>{r}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)", marginBottom: "0.75rem" }}>
                Goals
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {GOALS.map(g => (
                  <button key={g} onClick={() => toggle(goals, setGoals, g)} style={{
                    padding: "0.4rem 0.875rem", borderRadius: "9999px",
                    border: `1.5px solid ${goals.includes(g) ? "var(--color-sage)" : "var(--color-sand)"}`,
                    backgroundColor: goals.includes(g) ? "var(--color-sage)" : "transparent",
                    color: goals.includes(g) ? "white" : "var(--color-charcoal)",
                    fontSize: "0.8125rem", fontWeight: 500, cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}>{g}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {mode === "fridge" && (
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-charcoal)", marginBottom: "0.375rem" }}>
              What do you have right now?
            </p>
            <p style={{ fontSize: "0.8125rem", color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)", marginBottom: "0.875rem" }}>
              Type 3–6 ingredients. The AI will build a postpartum-optimized meal from exactly these.
            </p>
            <textarea
              value={fridgeIngredients}
              onChange={e => setFridgeIngredients(e.target.value)}
              placeholder="e.g. eggs, spinach, bread, Greek yoghurt, banana, olive oil…"
              rows={3}
              style={{
                width: "100%", padding: "1rem", borderRadius: "1rem",
                border: "1.5px solid var(--color-sand)",
                fontFamily: "var(--font-sans)", fontSize: "0.9375rem",
                color: "var(--color-charcoal)", resize: "none", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => { e.target.style.borderColor = "var(--color-rose)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--color-sand)"; }}
            />
          </div>
        )}

        {mode === "2am" && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "1rem 1.25rem",
              backgroundColor: "color-mix(in srgb, var(--color-forest) 6%, transparent)",
              borderRadius: "1rem",
              border: "1px solid color-mix(in srgb, var(--color-forest) 12%, transparent)",
            }}>
              <Moon size={20} color="var(--color-purple)" />
              <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "color-mix(in srgb, var(--color-charcoal) 68%, transparent)" }}>
                It&apos;s the middle of the night. You&apos;re feeding your baby. The AI will give you 3 snacks you can make and eat with one hand, right now, in the dark.
              </p>
            </div>
          </div>
        )}

        <button onClick={generate} disabled={loading || (mode === "fridge" && !fridgeIngredients.trim())} style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.875rem 1.75rem",
          backgroundColor: mode === "2am" ? "var(--color-forest)" : "var(--color-rose)",
          color: "white", border: "none", borderRadius: "9999px",
          fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer",
          fontFamily: "var(--font-sans)",
          opacity: (loading || (mode === "fridge" && !fridgeIngredients.trim())) ? 0.5 : 1,
          boxShadow: mode === "2am" ? "none" : "0 2px 8px rgba(214,63,110,0.3)",
        }}>
          <Sparkles size={16} />
          {loading ? "Generating…" : mode === "2am" ? "What can I eat right now?" : mode === "fridge" ? "Build meals from this" : "Generate today's plan"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{
          backgroundColor: mode === "2am" ? "var(--color-forest)" : "white",
          border: `1px solid ${mode === "2am" ? "rgba(255,255,255,0.08)" : "var(--color-sand)"}`,
          borderRadius: "1.25rem",
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "var(--shadow-sm)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
            <Sparkles size={15} color={mode === "2am" ? "var(--color-purple)" : "var(--color-rose)"} />
            <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: mode === "2am" ? "rgba(251,247,242,0.45)" : "color-mix(in srgb, var(--color-charcoal) 45%, transparent)" }}>
              {mode === "2am" ? "Right now" : mode === "fridge" ? "From your fridge" : "Today's plan"}
            </p>
          </div>
          <div style={{
            fontSize: "0.9375rem", lineHeight: 1.75,
            color: mode === "2am" ? "rgba(251,247,242,0.82)" : "color-mix(in srgb, var(--color-charcoal) 72%, transparent)",
            whiteSpace: "pre-wrap",
          }}>
            {result}
          </div>
        </div>
      )}

      {/* Sample meals */}
      <div>
        <p style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)", marginBottom: "1rem" }}>
          Postpartum favourites
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.875rem" }}>
          {SAMPLE_MEALS.map(m => (
            <div key={m.name} style={{
              backgroundColor: "white", border: "1px solid var(--color-sand)",
              borderRadius: "1.125rem", padding: "1.125rem",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                {m.tags.map(t => (
                  <span key={t} style={{
                    fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "var(--color-rose)", backgroundColor: "var(--color-rose-light)",
                    padding: "0.15rem 0.5rem", borderRadius: "9999px",
                  }}>{t}</span>
                ))}
              </div>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.9375rem", fontWeight: 400, color: "var(--color-charcoal)", marginBottom: "0.375rem" }}>
                {m.name}
              </p>
              <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, color: "color-mix(in srgb, var(--color-charcoal) 58%, transparent)" }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
