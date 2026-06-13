"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  user?: { email?: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isLanding = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: isLanding ? "rgba(255,248,240,0.85)" : "rgba(255,248,240,0.98)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--color-sand)",
      }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>Dashboard</Link>
              <button onClick={handleSignOut} className="btn-secondary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium" style={{ color: "var(--color-charcoal)" }}>Sign in</Link>
              <Link href="/signup" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}>Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
