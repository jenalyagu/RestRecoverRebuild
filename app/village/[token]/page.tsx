import { createClient } from "@/lib/supabase/server";
import VillageShareView from "./VillageShareView";
import { notFound } from "next/navigation";

export default async function VillageSharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: share } = await supabase
    .from("village_shares")
    .select("*, profiles!inner(first_name, baby_name)")
    .eq("token", token)
    .single();

  if (!share) notFound();

  return <VillageShareView share={share} token={token} />;
}
