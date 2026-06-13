"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Settings, LogOut, BarChart2, Heart, ShoppingBag, BookOpen, Users, Utensils, CalendarCheck, TrendingUp, FileText, Sparkles, Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Daily Check-In", href: "/dashboard/checkin", icon: CalendarCheck },
  { label: "Mood Tracker", href: "/dashboard/mood", icon: TrendingUp },
  { label: "Recovery Plan", href: "/dashboard/plan", icon: Sparkles },
  { label: "Recovery AI", href: "/dashboard/chat", icon: MessageCircle },
  { label: "Village", href: "/dashboard/village", icon: Users },
  { label: "Templates", href: "/dashboard/templates", icon: FileText },
  { label: "Recovery Hub", href: "/dashboard/hub", icon: Heart },
  { label: "Meal Planner", href: "/dashboard/meals", icon: Utensils },
  { label: "Learn", href: "/dashboard/learn", icon: BookOpen },
  { label: "Shop", href: "/dashboard/shop", icon: ShoppingBag },
  { label: "Assessment", href: "/dashboard/assessment", icon: BarChart2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

// The 5 most important tabs for the mobile bottom nav
const bottomNavItems = [
  { label: "Home", href: "/dashboard", icon: Home, exact: true },
  { label: "Check-in", href: "/dashboard/checkin", icon: CalendarCheck, exact: false },
  { label: "Village", href: "/dashboard/village", icon: Users, exact: false },
  { label: "AI Chat", href: "/dashboard/chat", icon: MessageCircle, exact: false },
  { label: "Plan", href: "/dashboard/plan", icon: Sparkles, exact: false },
];

interface DashboardShellProps {
  children: React.ReactNode;
  userEmail?: string;
}

export default function DashboardShell({ children, userEmail }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--color-cream)" }}>

      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-64 shrink-0 border-r flex-col sticky top-0 h-screen overflow-y-auto"
        style={{ backgroundColor: "var(--color-forest)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="p-6 border-b shrink-0" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Logo variant="light" size="sm" />
          <p className="text-xs mt-1" style={{ color: "rgba(255,248,240,0.5)" }}>Postpartum Recovery</p>
        </div>

        <nav className="flex-1 p-4 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href, href === "/dashboard");
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                style={{
                  color: active ? "var(--color-cream)" : "rgba(255,248,240,0.6)",
                  backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
                }}>
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t shrink-0" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {userEmail && (
            <p className="text-xs mb-3 truncate px-3" style={{ color: "rgba(255,248,240,0.4)" }}>{userEmail}</p>
          )}
          <button onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-colors duration-150"
            style={{ color: "rgba(255,248,240,0.6)" }}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile full-screen drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />

          {/* Drawer panel */}
          <div className="relative z-10 w-72 flex flex-col h-full overflow-y-auto"
            style={{ backgroundColor: "var(--color-forest)" }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <Logo variant="light" size="sm" />
              <button onClick={() => setDrawerOpen(false)} style={{ color: "rgba(255,248,240,0.6)" }}>
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-0.5">
              {navItems.map(({ label, href, icon: Icon }) => {
                const active = isActive(href, href === "/dashboard");
                return (
                  <Link key={href} href={href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-150"
                    style={{
                      color: active ? "var(--color-cream)" : "rgba(255,248,240,0.65)",
                      backgroundColor: active ? "rgba(255,255,255,0.1)" : "transparent",
                    }}>
                    <Icon size={17} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              {userEmail && (
                <p className="text-xs mb-3 truncate px-3" style={{ color: "rgba(255,248,240,0.4)" }}>{userEmail}</p>
              )}
              <button onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium w-full"
                style={{ color: "rgba(255,248,240,0.6)" }}>
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b"
          style={{ backgroundColor: "var(--color-cream)", borderColor: "var(--color-sand)" }}>
          <Logo variant="dark" size="sm" />
          <button onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-forest) 8%, transparent)" }}>
            <Menu size={18} style={{ color: "var(--color-forest)" }} />
          </button>
        </div>

        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t"
        style={{ backgroundColor: "var(--color-cream)", borderColor: "var(--color-sand)" }}>
        {bottomNavItems.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
              style={{ color: active ? "var(--color-rose)" : "color-mix(in srgb, var(--color-charcoal) 40%, transparent)" }}>
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
              {active && <span className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--color-rose)" }} />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
