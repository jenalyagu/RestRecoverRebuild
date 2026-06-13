"use client";

import { useEffect, useState } from "react";
import { recoveryLabel } from "@/lib/recovery";

interface RecoveryRingProps {
  score: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function RecoveryRing({ score, max = 50, size = "md", showLabel = true }: RecoveryRingProps) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(score), 100); return () => clearTimeout(t); }, [score]);

  const dims = { sm: 100, md: 140, lg: 180 }[size];
  const r = dims * 0.4;
  const cx = dims / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - animated / max);
  const strokeW = size === "sm" ? 7 : size === "lg" ? 12 : 10;
  const scoreSize = size === "sm" ? 20 : size === "lg" ? 36 : 28;
  const labelSize = size === "sm" ? 8 : size === "lg" ? 12 : 10;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={dims} height={dims} viewBox={`0 0 ${dims} ${dims}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--color-sand)" strokeWidth={strokeW} />
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--color-rose)" strokeWidth={strokeW}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cx})`} style={{ transition: "stroke-dashoffset 1s ease" }} />
        <text x={cx} y={cx - 4} textAnchor="middle" fontSize={scoreSize}
          fontFamily="var(--font-newsreader), Georgia, serif" fill="var(--color-charcoal)" fontWeight="300">
          {score}
        </text>
        <text x={cx} y={cx + labelSize + 4} textAnchor="middle" fontSize={labelSize}
          fontFamily="var(--font-plus-jakarta), sans-serif" fill="#9A9790" letterSpacing="1">
          RECOVERY
        </text>
      </svg>
      {showLabel && (
        <p className="text-xs text-center max-w-[160px]"
          style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>
          {recoveryLabel(score)}
        </p>
      )}
    </div>
  );
}
