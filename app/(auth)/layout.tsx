export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: "var(--color-cream)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="font-serif text-2xl font-medium no-underline"
            style={{ color: "var(--color-charcoal)" }}>
            RestRecoverRebuild
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
