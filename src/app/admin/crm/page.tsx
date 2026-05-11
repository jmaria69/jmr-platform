import type { Metadata } from "next";
import { CRMPipeline } from "@/components/crm/pipeline";
import { findAllContacts } from "@/lib/repositories/crm.repository";

export const metadata: Metadata = {
  title: "CRM",
};

export default async function CRMPage() {
  const contacts = await findAllContacts();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">CRM Circular</h2>
        <p className="text-muted-foreground">
          Pipeline de ventas y gestión de contactos.
        </p>
      </div>

      <CRMPipeline contacts={contacts} />
    </div>
  );
}
