-- Visibilidad por proyecto controlada desde admin: home y laboratorio.
ALTER TABLE "projects" ADD COLUMN "show_on_home" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "projects" ADD COLUMN "show_in_lab" BOOLEAN NOT NULL DEFAULT true;

-- Siembra inicial: destaca en home los que están en producción y NO son
-- productos con landing propia (siam/crm-it/admin-app se muestran en su
-- sección de productos, no como proyectos/demos). El resto se ajusta en admin.
UPDATE "projects"
   SET "show_on_home" = true
 WHERE "status" = 'production'
   AND "id" NOT IN ('siam', 'crm-it', 'admin-app');
