/**
 * CRM Repository — Data Access Layer
 *
 * Dual-mode: Drizzle/Neon when DATABASE_URL is set,
 * in-memory fallback for local dev without a DB.
 */

import { CRMContact, Interaction, CRMPipelineStage } from "@/types";
import { crmContacts as seed } from "@/lib/mock-data";

// ─── Database imports (lazy) ───
let _dbModule: typeof import("@/lib/db") | null = null;
let _schemaModule: typeof import("@/lib/db/schema") | null = null;
let _eqFn: typeof import("drizzle-orm")["eq"] | null = null;
let _orFn: typeof import("drizzle-orm")["or"] | null = null;
let _ilikeFn: typeof import("drizzle-orm")["ilike"] | null = null;

async function getDbModules() {
  if (!process.env.DATABASE_URL) return null;
  if (!_dbModule) {
    _dbModule = await import("@/lib/db");
    _schemaModule = await import("@/lib/db/schema");
    const drizzleOrm = await import("drizzle-orm");
    _eqFn = drizzleOrm.eq;
    _orFn = drizzleOrm.or;
    _ilikeFn = drizzleOrm.ilike;
  }
  return {
    getDb: _dbModule!.getDb,
    schema: _schemaModule!,
    eq: _eqFn!,
    or: _orFn!,
    ilike: _ilikeFn!,
  };
}

// ─── In-memory fallback store ───
let memoryStore: CRMContact[] = [...seed];

// ─── Helpers ───

function dbRowToContact(
  row: Record<string, unknown>,
  contactInteractions: Interaction[] = []
): CRMContact {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone ?? undefined) as string | undefined,
    company: (row.company ?? undefined) as string | undefined,
    source: row.source as CRMContact["source"],
    stage: row.stage as CRMContact["stage"],
    value: row.value as number,
    notes: row.notes as string,
    tags: (row.tags ?? []) as string[],
    lastContact: new Date(row.lastContact as string | Date),
    createdAt: new Date(row.createdAt as string | Date),
    interactions: contactInteractions,
  };
}

function dbRowToInteraction(row: Record<string, unknown>): Interaction {
  return {
    id: row.id as string,
    type: row.type as Interaction["type"],
    date: new Date(row.date as string | Date),
    summary: row.summary as string,
  };
}

// ─── Read operations ───

export async function findAllContacts(): Promise<CRMContact[]> {
  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    const rows = await db.select().from(mods.schema.crmContacts);
    const contactIds = rows.map((r) => r.id);

    // Batch-fetch interactions
    let allInteractions: Record<string, unknown>[] = [];
    if (contactIds.length > 0) {
      allInteractions = await db.select().from(mods.schema.interactions);
    }

    return rows.map((row) => {
      const ints = allInteractions
        .filter((i) => (i as { contactId: string }).contactId === row.id)
        .map(dbRowToInteraction);
      return dbRowToContact(row, ints);
    });
  }
  return [...memoryStore];
}

export async function findContactById(id: string): Promise<CRMContact | undefined> {
  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    const rows = await db
      .select()
      .from(mods.schema.crmContacts)
      .where(mods.eq(mods.schema.crmContacts.id, id));
    if (!rows[0]) return undefined;

    const ints = await db
      .select()
      .from(mods.schema.interactions)
      .where(mods.eq(mods.schema.interactions.contactId, id));

    return dbRowToContact(rows[0], ints.map(dbRowToInteraction));
  }
  return memoryStore.find((c) => c.id === id);
}

export async function findContactsByStage(
  stage: CRMContact["stage"]
): Promise<CRMContact[]> {
  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    const rows = await db
      .select()
      .from(mods.schema.crmContacts)
      .where(mods.eq(mods.schema.crmContacts.stage, stage));

    const allInts = await db.select().from(mods.schema.interactions);
    return rows.map((row) => {
      const ints = allInts
        .filter((i) => i.contactId === row.id)
        .map(dbRowToInteraction);
      return dbRowToContact(row, ints);
    });
  }
  return memoryStore.filter((c) => c.stage === stage);
}

export async function searchContacts(query: string): Promise<CRMContact[]> {
  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    const pattern = `%${query}%`;
    const rows = await db
      .select()
      .from(mods.schema.crmContacts)
      .where(
        mods.or(
          mods.ilike(mods.schema.crmContacts.name, pattern),
          mods.ilike(mods.schema.crmContacts.email, pattern),
          mods.ilike(mods.schema.crmContacts.company, pattern)
        )
      );
    return rows.map((row) => dbRowToContact(row));
  }

  const q = query.toLowerCase();
  return memoryStore.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );
}

// ─── Write operations ───

export async function createContact(
  data: Omit<CRMContact, "id" | "createdAt" | "interactions">
): Promise<CRMContact> {
  const id = `c-${Date.now()}`;

  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    await db.insert(mods.schema.crmContacts).values({
      id,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
      source: data.source,
      stage: data.stage,
      value: data.value,
      notes: data.notes,
      tags: data.tags,
      lastContact: data.lastContact,
    });
    return { ...data, id, createdAt: new Date(), interactions: [] };
  }

  const contact: CRMContact = {
    ...data,
    id,
    createdAt: new Date(),
    interactions: [],
  };
  memoryStore = [...memoryStore, contact];
  return contact;
}

export async function updateContact(
  id: string,
  data: Partial<Omit<CRMContact, "id" | "createdAt">>
): Promise<CRMContact> {
  const existing = await findContactById(id);
  if (!existing) throw new ContactNotFoundError(id);

  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    const updateData: Record<string, unknown> = {};
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

    await db
      .update(mods.schema.crmContacts)
      .set(updateData)
      .where(mods.eq(mods.schema.crmContacts.id, id));

    return { ...existing, ...data };
  }

  const updated = { ...existing, ...data };
  memoryStore = memoryStore.map((c) => (c.id === id ? updated : c));
  return updated;
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

  const interactionId = `i-${Date.now()}`;

  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    await db.insert(mods.schema.interactions).values({
      id: interactionId,
      contactId,
      type: interaction.type,
      date: interaction.date,
      summary: interaction.summary,
    });
    await db
      .update(mods.schema.crmContacts)
      .set({ lastContact: interaction.date })
      .where(mods.eq(mods.schema.crmContacts.id, contactId));

    return findContactById(contactId) as Promise<CRMContact>;
  }

  const newInteraction: Interaction = { ...interaction, id: interactionId };
  return updateContact(contactId, {
    interactions: [...contact.interactions, newInteraction],
    lastContact: interaction.date,
  });
}

export async function deleteContact(id: string): Promise<void> {
  const existing = await findContactById(id);
  if (!existing) throw new ContactNotFoundError(id);

  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    await db
      .delete(mods.schema.crmContacts)
      .where(mods.eq(mods.schema.crmContacts.id, id));
    return;
  }

  memoryStore = memoryStore.filter((c) => c.id !== id);
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
        ? (all.filter((c) => c.stage === "closed-won").length / all.length) * 100
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
