"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/ui/Spinner";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm px-4 py-3 rounded-xl"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-rose) 10%, transparent)", color: "var(--color-rose)" }}>
          {error}
        </div>
      )}
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div>
        <label className="label">Password</label>
        <input className="input" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? <><Spinner size="sm" /> Signing in…</> : "Sign in"}
      </button>
    </form>
  );
}
