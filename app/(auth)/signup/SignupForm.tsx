"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/ui/Spinner";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true); setError("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    // If email confirmation is on, session won't exist yet — sign in immediately
    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("Account created — please check your email to confirm, then sign in.");
        setLoading(false); return;
      }
    }
    router.refresh();
    router.push("/intake");
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
        <input className="input" type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" />
      </div>
      <div>
        <label className="label">Confirm password</label>
        <input className="input" type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Same as above" />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? <><Spinner size="sm" /> Creating account…</> : "Create account"}
      </button>
    </form>
  );
}
