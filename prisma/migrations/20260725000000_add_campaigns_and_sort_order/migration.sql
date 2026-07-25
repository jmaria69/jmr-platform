-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 9999;

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "channel" TEXT NOT NULL DEFAULT 'linkedin',
    "status" TEXT NOT NULL DEFAULT 'activa',
    "target_url" TEXT NOT NULL,
    "utm_source" TEXT NOT NULL DEFAULT '',
    "utm_medium" TEXT NOT NULL DEFAULT '',
    "utm_campaign" TEXT NOT NULL DEFAULT '',
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_clicks" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referer" TEXT NOT NULL DEFAULT '',
    "user_agent" TEXT NOT NULL DEFAULT '',
    "ip_hash" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "campaign_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_slug_key" ON "campaigns"("slug");

-- CreateIndex
CREATE INDEX "campaign_clicks_campaign_id_ts_idx" ON "campaign_clicks"("campaign_id", "ts");

-- AddForeignKey
ALTER TABLE "campaign_clicks" ADD CONSTRAINT "campaign_clicks_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

