import type { Metadata } from "next";
import { CRMPipeline } from "@/components/crm/pipeline";
import { findAllContacts } from "@/lib/repositories/crm.repository";

export const metadata: Metadata = {
    title: "Demo — CRM",
};

export default async function DemoCRMPage() {
    const contacts = await findAllContacts();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">CRM Demo</h2>
                <p className="text-muted-foreground">
                    Pipeline de ventas en modo visualización.{" "}
                    <strong>Inicia sesión para gestionar contactos.</strong>
                </p>
            </div>

            <CRMPipeline contacts={contacts} />
        </div>
    );
}
