-- Configuración de apariencia de la home (un único registro, JSON).
CREATE TABLE IF NOT EXISTS "home_config" (
  "id" INTEGER NOT NULL DEFAULT 1,
  "data" JSONB NOT NULL DEFAULT '{}',
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "home_config_pkey" PRIMARY KEY ("id")
);
INSERT INTO "home_config" ("id","data") VALUES (1, '{}') ON CONFLICT ("id") DO NOTHING;
