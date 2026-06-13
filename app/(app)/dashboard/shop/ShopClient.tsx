"use client";

import { useState } from "react";
import { MARKETPLACE_DEALS } from "@/lib/data";

const CATEGORIES = ["All", ...Array.from(new Set(MARKETPLACE_DEALS.map(d => d.category)))];

export default function ShopClient() {
  const [cat, setCat] = useState("All");

  const filtered = cat === "All" ? MARKETPLACE_DEALS : MARKETPLACE_DEALS.filter(d => d.category === cat);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="font-serif text-3xl font-light mb-2" style={{ color: "var(--color-charcoal)" }}>Shop</h1>
      <p className="text-sm mb-6" style={{ color: "color-mix(in srgb, var(--color-charcoal) 50%, transparent)" }}>
        Curated postpartum essentials — vetted for new mamas
      </p>

      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={cat === c
              ? { backgroundColor: "var(--color-forest)", color: "var(--color-cream)" }
              : { backgroundColor: "var(--color-cream)", color: "var(--color-charcoal)", border: "1px solid var(--color-sand)" }}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((deal, i) => (
          <div key={i} className="card p-5 hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <span className="section-tag">{deal.category}</span>
              {deal.badge && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: deal.badgeColor || "color-mix(in srgb, var(--color-rose) 12%, transparent)", color: deal.badgeText || "var(--color-rose)" }}>
                  {deal.badge}
                </span>
              )}
            </div>
            <p className="font-serif text-sm font-medium mb-0.5 flex-1" style={{ color: "var(--color-charcoal)" }}>{deal.title}</p>
            <p className="text-xs mb-1" style={{ color: "color-mix(in srgb, var(--color-charcoal) 40%, transparent)" }}>{deal.vendor}</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>{deal.desc}</p>
            <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: "var(--color-sand)" }}>
              {deal.price && <span className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>{deal.price}</span>}
              <a href={deal.url || "#"} target="_blank" rel="noreferrer"
                className="text-xs font-semibold transition-opacity hover:opacity-75" style={{ color: "var(--color-rose)" }}>
                View deal →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
