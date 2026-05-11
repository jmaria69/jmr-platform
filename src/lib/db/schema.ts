/**
 * Drizzle ORM Schema — Single source of truth for database structure
 *
 * Tables: admin_users, projects, crm_contacts, interactions
 */

import {
  pgTable,
  text,
  varchar,
  integer,
  real,
  boolean,
  timestamp,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";

// ─── Admin Users ───

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

// ─── Projects ───

export const projects = pgTable("projects", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description").notNull().default(""),
  tech: jsonb("tech").$type<string[]>().notNull().default([]),
  status: varchar("status", { length: 50 })
    .$type<"production" | "beta" | "development">()
    .notNull()
    .default("development"),
  category: varchar("category", { length: 50 })
    .$type<"web" | "desktop" | "mobile" | "ai" | "automation">()
    .notNull(),
  url: varchar("url", { length: 500 }),
  github: varchar("github", { length: 500 }),
  image: varchar("image", { length: 500 }).notNull().default("/placeholder.svg"),
  color: varchar("color", { length: 7 }).notNull().default("#6366f1"),
  metricsUsers: integer("metrics_users"),
  metricsRevenue: real("metrics_revenue"),
  metricsRating: real("metrics_rating"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── CRM Contacts ───

export const crmContacts = pgTable("crm_contacts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  source: varchar("source", { length: 50 })
    .$type<"web" | "referral" | "social" | "direct" | "campaign">()
    .notNull()
    .default("web"),
  stage: varchar("stage", { length: 50 })
    .$type<"lead" | "contacted" | "qualified" | "proposal" | "negotiation" | "closed-won" | "closed-lost">()
    .notNull()
    .default("lead"),
  value: real("value").notNull().default(0),
  notes: text("notes").notNull().default(""),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  lastContact: timestamp("last_contact").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── CRM Interactions ───

export const interactions = pgTable("interactions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  contactId: varchar("contact_id", { length: 255 })
    .notNull()
    .references(() => crmContacts.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 })
    .$type<"email" | "call" | "meeting" | "note" | "demo">()
    .notNull(),
  date: timestamp("date").defaultNow().notNull(),
  summary: text("summary").notNull().default(""),
});
