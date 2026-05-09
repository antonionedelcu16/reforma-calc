import { createClient } from "../../../lib/supabase/server";
import { notFound } from "next/navigation";
import { DEFAULT_CONFIG, StaticConfigProvider, CompanyConfig } from "../../context/ConfigContext";
import Calculator from "../../components/Calculator";

export const revalidate = 60;

export default async function CalcPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("calculators")
    .select("config")
    .eq("slug", slug)
    .single();

  if (!data) notFound();

  const config: CompanyConfig = { ...DEFAULT_CONFIG, ...data.config };

  return (
    <StaticConfigProvider config={config}>
      <Calculator />
    </StaticConfigProvider>
  );
}
