import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import { projects as seedProjects } from "@/lib/projects";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("Ensuring campaigns exist for all projects...");

  // We'll use the seed projects list to know what projects we expect.
  // In a real scenario, we might want to fetch from the database, but using seed is safe.
  for (const project of seedProjects) {
    const slug = project.id;

    // Check if a campaign with this slug exists
    const existing = await prisma.campaign.findUnique({ where: { slug } });

    if (existing) {
      console.log(`✓ Campaign for slug "${slug}" already exists (status: ${existing.status}).`);
      // If it's in a reviewed state, we don't overwrite by default.
      const reviewedStatuses = new Set(["activa", "pausada", "finalizada"]);
      if (reviewedStatuses.has(existing.status)) {
        console.log(`  Skipping overwrite because it's in reviewed state "${existing.status}".`);
        continue;
      }
      // If it's in "borrador", we can update it with the project's details.
      console.log(`  Updating borrador campaign with project details.`);
      await prisma.campaign.update({
        where: { id: existing.id },
        data: {
          name: project.name,
          description: project.description || "",
          targetUrl: project.url || "",
          utmSource: "", // default
          utmMedium: "", // default
          utmCampaign: project.id, // use project id as utmCampaign
          // Note: we leave researchNotes, script, videoUrl as they are (or null)
        },
      });
    } else {
      console.log(`✗ Campaign for slug "${slug}" does not exist. Creating borrador.`);
      await prisma.campaign.create({
        data: {
          slug,
          name: project.name,
          description: project.description || "",
          targetUrl: project.url || "",
          channel: "linkedin", // default channel
          status: "borrador",
          utmSource: "",
          utmMedium: "",
          utmCampaign: project.id,
          researchNotes: null,
          script: null,
          videoUrl: null,
        },
      });
      console.log(`  Created borrador campaign for "${slug}".`);
      console.log(`  Short link: https://praxialabs.com/c/${slug}`);
    }
  }

  console.log("✅ Finished ensuring campaigns for all projects.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });