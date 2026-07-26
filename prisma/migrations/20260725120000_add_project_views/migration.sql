-- CreateTable
CREATE TABLE "project_views" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referer" TEXT NOT NULL DEFAULT '',
    "user_agent" TEXT NOT NULL DEFAULT '',
    "ip_hash" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "project_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_views_project_id_ts_idx" ON "project_views"("project_id", "ts");

