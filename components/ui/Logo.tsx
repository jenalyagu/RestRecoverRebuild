import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export default function Logo({ variant = "dark", size = "md" }: LogoProps) {
  const sizeClasses = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" };
  const color = variant === "light" ? "rgba(255,248,240,0.95)" : "var(--color-charcoal)";
  return (
    <Link href="/" style={{ color, textDecoration: "none", fontFamily: "var(--font-serif)", fontWeight: 500 }}
      className={sizeClasses[size]}>
      RestRecoverRebuild
    </Link>
  );
}
