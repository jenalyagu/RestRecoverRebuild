import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "nav" | "sm" | "md" | "lg" | "xl";
  href?: string;
}

// RRRPrimary.png is 1254×1254 — square, transparent bg
// "nav" size is tuned to sit inside a 64px tall navbar with the subtitle legible
// RRRPrimary.png is 1024×639 (cropped to content, transparent bg)
const WIDTHS: Record<string, number> = {
  nav: 150,
  sm:  130,
  md:  200,
  lg:  260,
  xl:  340,
};
const ASPECT = 639 / 1024;

export default function Logo({ size = "nav", href = "/" }: LogoProps) {
  const w = WIDTHS[size];
  const h = Math.round(w * ASPECT);
  return (
    <Link href={href} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
      <Image
        src="/RRRPrimary.png"
        alt="RestRecoverRebuild — AI-Powered Recovery System"
        width={w}
        height={h}
        priority
        style={{ objectFit: "contain", display: "block" }}
      />
    </Link>
  );
}
