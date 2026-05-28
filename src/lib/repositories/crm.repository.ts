import { prisma } from "@/lib/prisma";
import { CRMContact, Interaction, CRMPipelineStage } from "@/types";
import { crmContacts as seed } from "@/lib/mock-data";

// ─── Helper: DB row to domain model ───
function dbRowToContact(row: any, interactions: Interaction[] = []): CRMContact {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    company: row.company || undefined,
    source: row.source as CRMContact["source"],
    stage: row.stage as CRMContact["stage"],
    value: row.value,
    notes: row.notes,
    tags: row.tags || [],
    lastContact: row.lastContact,
    createdAt: row.createdAt,
    interactions,
  };
}

function dbRowToInteraction(row: any): Interaction {
  return {
    id: row.id,
    type: row.type as Interaction["type"],
    date: row.date,
    summary: row.summary,
  };
}

// ─── Read operations ───

export async function findAllContacts(): Promise<CRMContact[]> {
  try {
    const contacts = await prisma.crmContact.findMany({
      include: { interactions: true },
    });
    return contacts.map((c) =>
      dbRowToContact(c, c.interactions.map(dbRowToInteraction))
    );
  } catch (err) {
    // Fallback to seed on DB error
    console.warn("DB error, using seed data:", err);
    return seed;
  }
}

export async function findContactById(id: string): Promise<CRMContact | undefined> {
  try {
    const contact = await prisma.crmContact.findUnique({
      where: { id },
      include: { interactions: true },
    });
    console.log("DEBUG findContactById:", { id, contact, interactions: contact?.interactions });
    if (!contact) return undefined;
    return dbRowToContact(
      contact,
      contact.interactions.map(dbRowToInteraction)
    );
  } catch (err) {
    console.warn("DB error:", err);
    return seed.find((c) => c.id === id);
  }
}

export async function findContactsByStage(
  stage: CRMContact["stage"]
): Promise<CRMContact[]> {
  try {
    const contacts = await prisma.crmContact.findMany({
      where: { stage },
      include: { interactions: true },
    });
    return contacts.map((c) =>
      dbRowToContact(c, c.interactions.map(dbRowToInteraction))
    );
  } catch (err) {
    console.warn("DB error:", err);
    return seed.filter((c) => c.stage === stage);
  }
}

export async function searchContacts(query: string): Promise<CRMContact[]> {
  try {
    const contacts = await prisma.crmContact.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { company: { contains: query, mode: "insensitive" } },
          { tags: { hasSome: [query] } },
        ],
      },
      include: { interactions: true },
    });
    return contacts.map((c) =>
      dbRowToContact(c, c.interactions.map(dbRowToInteraction))
    );
  } catch (err) {
    console.warn("DB error:", err);
    const q = query.toLowerCase();
    return seed.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
}

// ─── Write operations ───

export async function createContact(
  data: Omit<CRMContact, "id" | "createdAt" | "interactions">
): Promise<CRMContact> {
  const id = `c-${Date.now()}`;
  try {
    const contact = await prisma.crmContact.create({
      data: {
        id,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        source: data.source,
        stage: data.stage,
        value: data.value,
        notes: data.notes,
        tags: data.tags,
        lastContact: data.lastContact,
      },
    });
    return dbRowToContact(contact, []);
  } catch (err) {
    console.error("Create contact error:", err);
    throw err;
  }
}

export async function updateContact(
  id: string,
  data: Partial<Omit<CRMContact, "id" | "createdAt">>
): Promise<CRMContact> {
  const existing = await findContactById(id);
  if (!existing) throw new ContactNotFoundError(id);

  try {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.stage !== undefined) updateData.stage = data.stage;
    if (data.value !== undefined) updateData.value = data.value;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.lastContact !== undefined) updateData.lastContact = data.lastContact;

    const contact = await prisma.crmContact.update({
      where: { id },
      data: updateData,
      include: { interactions: true },
    });

    return dbRowToContact(
      contact,
      contact.interactions.map(dbRowToInteraction)
    );
  } catch (err) {
    console.error("Update contact error:", err);
    throw err;
  }
}

export async function moveContactToStage(
  id: string,
  stage: CRMContact["stage"]
): Promise<CRMContact> {
  return updateContact(id, { stage });
}

export async function addInteraction(
  contactId: string,
  interaction: Omit<Interaction, "id">
): Promise<CRMContact> {
  const contact = await findContactById(contactId);
  if (!contact) throw new ContactNotFoundError(contactId);

  try {
    await prisma.interaction.create({
      data: {
        contactId,
        type: interaction.type,
        date: interaction.date,
        summary: interaction.summary,
      },
    });

    await prisma.crmContact.update({
      where: { id: contactId },
      data: { lastContact: interaction.date },
    });

    const updated = await findContactById(contactId);
    return updated!;
  } catch (err) {
    console.error("Add interaction error:", err);
    throw err;
  }
}

export async function deleteContact(id: string): Promise<void> {
  const existing = await findContactById(id);
  if (!existing) throw new ContactNotFoundError(id);

  try {
    await prisma.crmContact.delete({ where: { id } });
  } catch (err) {
    console.error("Delete contact error:", err);
    throw err;
  }
}

// ─── Aggregate queries ───

export async function getPipelineStages(): Promise<CRMPipelineStage[]> {
  const stages: CRMContact["stage"][] = [
    "lead",
    "contacted",
    "qualified",
    "proposal",
    "negotiation",
    "closed-won",
    "closed-lost",
  ];

  const all = await findAllContacts();
  return stages.map((stage) => {
    const contacts = all.filter((c) => c.stage === stage);
    return {
      id: stage,
      name: stage,
      contacts,
      totalValue: contacts.reduce((sum, c) => sum + c.value, 0),
    };
  });
}

export async function getCRMStats() {
  const all = await findAllContacts();
  return {
    totalContacts: all.length,
    totalPipelineValue: all
      .filter((c) => c.stage !== "closed-lost")
      .reduce((sum, c) => sum + c.value, 0),
    wonDeals: all.filter((c) => c.stage === "closed-won").length,
    wonValue: all
      .filter((c) => c.stage === "closed-won")
      .reduce((sum, c) => sum + c.value, 0),
    conversionRate:
      all.length > 0
        ? (all.filter((c) => c.stage === "closed-won").length / all.length) *
        100
        : 0,
  };
}

// ─── Custom errors ───

export class ContactNotFoundError extends Error {
  constructor(id: string) {
    super(`Contact not found: ${id}`);
    this.name = "ContactNotFoundError";
  }
}