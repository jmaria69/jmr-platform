import type { Metadata } from "next";
import { CampaignsManager } from "@/components/admin/campaigns-manager";
import { findAllCampaigns } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "Campañas",
};

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns = await findAllCampaigns();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Campañas de Marketing</h2>
        <p className="text-muted-foreground">
          Enlaces cortos rastreables con métricas de clicks en primera parte.
        </p>
      </div>

      <CampaignsManager initialCampaigns={campaigns} />
    </div>
  );
}
