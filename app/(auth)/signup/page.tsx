import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="card p-8">
      <h1 className="font-serif text-2xl font-light mb-1" style={{ color: "var(--color-charcoal)" }}>
        Start your recovery plan
      </h1>
      <p className="text-sm mb-6" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>
        Create your free account to get started.
      </p>
      <SignupForm />
      <p className="text-sm text-center mt-6" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "var(--color-rose)", fontWeight: 500 }}>Sign in</a>
      </p>
    </div>
  );
}
