import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl font-light mb-1" style={{ color: "var(--color-charcoal)" }}>
        Welcome back
      </h1>
      <p className="text-sm mb-6" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>
        Sign in to your recovery dashboard.
      </p>
      <LoginForm />
      <p className="text-sm text-center mt-6" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>
        Don&apos;t have an account?{" "}
        <a href="/signup" style={{ color: "var(--color-rose)", fontWeight: 500 }}>Get started</a>
      </p>
    </div>
  );
}
