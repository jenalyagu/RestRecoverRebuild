import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import IntakeWizard from "./IntakeWizard";

export default async function IntakePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen px-6 py-12" style={{ backgroundColor: "var(--color-cream)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-tag">Recovery Setup</span>
          <h1 className="font-serif text-3xl md:text-4xl font-light" style={{ color: "var(--color-charcoal)" }}>
            Let&apos;s personalize your plan
          </h1>
          <p className="text-sm mt-2" style={{ color: "color-mix(in srgb, var(--color-charcoal) 55%, transparent)" }}>
            A few questions so we can give you guidance that fits your actual phase.
          </p>
        </div>
        <IntakeWizard userId={user.id} />
      </div>
    </div>
  );
}
