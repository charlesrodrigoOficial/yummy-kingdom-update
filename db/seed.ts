
import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PizzaCategory" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" TEXT NOT NULL UNIQUE,
      "description" TEXT,
      "createdAt" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT NOW()
    )
  `);
  await prisma.$executeRawUnsafe(`DELETE FROM "PizzaCategory"`);

  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });
  await prisma.$executeRawUnsafe(`
    INSERT INTO "PizzaCategory" ("name")
    SELECT DISTINCT "category"
    FROM "Product"
    ON CONFLICT ("name") DO NOTHING
  `);

  console.log("Database seeded")
  
}

main();
