import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContactDetail } from "@/components/crm/contact-detail";
import { findContactById } from "@/lib/repositories/crm.repository";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const contact = await findContactById(id);
  return { title: contact ? `CRM - ${contact.name}` : "Contacto no encontrado" };
}

export default async function ContactPage({ params }: Props) {
  const { id } = await params;
  const contact = await findContactById(id);
  if (!contact) notFound();

  return <ContactDetail contact={contact} />;
}
