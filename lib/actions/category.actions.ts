"use server";

import { prisma } from "@/db/prisma";
import { converToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import z from "zod";

type PizzaCategoryRow = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  productCount: number;
};

const pizzaCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  description: z.string().max(280).optional().nullable(),
});

const updatePizzaCategorySchema = pizzaCategorySchema.extend({
  id: z.string().uuid("Invalid category id"),
});

async function ensurePizzaCategoryTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PizzaCategory" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" TEXT NOT NULL UNIQUE,
      "description" TEXT,
      "createdAt" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT NOW()
    )
  `);
}

async function syncCategoriesFromProducts() {
  await prisma.$executeRawUnsafe(`
    INSERT INTO "PizzaCategory" ("name")
    SELECT DISTINCT "category"
    FROM "Product"
    WHERE "category" IS NOT NULL
      AND BTRIM("category") <> ''
    ON CONFLICT ("name") DO NOTHING
  `);
}

export async function getAllPizzaCategories() {
  await ensurePizzaCategoryTable();
  await syncCategoriesFromProducts();

  const categories = await prisma.$queryRaw<PizzaCategoryRow[]>`
    SELECT
      c."id",
      c."name",
      c."description",
      c."createdAt",
      c."updatedAt",
      COUNT(p."id")::int AS "productCount"
    FROM "PizzaCategory" c
    LEFT JOIN "Product" p ON LOWER(p."category") = LOWER(c."name")
    GROUP BY c."id", c."name", c."description", c."createdAt", c."updatedAt"
    ORDER BY c."name" ASC
  `;

  return converToPlainObject(categories);
}

export async function createPizzaCategory(
  data: z.infer<typeof pizzaCategorySchema>
) {
  try {
    await ensurePizzaCategoryTable();

    const parsed = pizzaCategorySchema.parse({
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || null,
    });

    await prisma.$executeRaw`
      INSERT INTO "PizzaCategory" ("name", "description")
      VALUES (${parsed.name}, ${parsed.description})
    `;

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/search");

    return {
      success: true,
      message: "Pizza category created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updatePizzaCategory(
  data: z.infer<typeof updatePizzaCategorySchema>
) {
  try {
    await ensurePizzaCategoryTable();

    const parsed = updatePizzaCategorySchema.parse({
      ...data,
      name: data.name.trim(),
      description: data.description?.trim() || null,
    });

    const previous = await prisma.$queryRaw<
      Array<{ id: string; name: string | null }>
    >`
      SELECT "id", "name"
      FROM "PizzaCategory"
      WHERE "id" = ${parsed.id}::uuid
      LIMIT 1
    `;

    if (!previous.length || !previous[0].name) {
      throw new Error("Category not found");
    }

    await prisma.$executeRaw`
      UPDATE "PizzaCategory"
      SET
        "name" = ${parsed.name},
        "description" = ${parsed.description},
        "updatedAt" = NOW()
      WHERE "id" = ${parsed.id}::uuid
    `;

    if (previous[0].name.toLowerCase() !== parsed.name.toLowerCase()) {
      await prisma.$executeRaw`
        UPDATE "Product"
        SET "category" = ${parsed.name}
        WHERE LOWER("category") = LOWER(${previous[0].name})
      `;
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/search");

    return {
      success: true,
      message: "Pizza category updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deletePizzaCategory(id: string) {
  try {
    await ensurePizzaCategoryTable();
    const parsedId = z.string().uuid("Invalid category id").parse(id);

    const category = await prisma.$queryRaw<
      Array<{ id: string; name: string | null }>
    >`
      SELECT "id", "name"
      FROM "PizzaCategory"
      WHERE "id" = ${parsedId}::uuid
      LIMIT 1
    `;

    if (!category.length || !category[0].name) {
      throw new Error("Category not found");
    }

    const usedByProducts = await prisma.$queryRaw<Array<{ total: number }>`
      SELECT COUNT(*)::int AS total
      FROM "Product"
      WHERE LOWER("category") = LOWER(${category[0].name})
    `;

    if (usedByProducts[0]?.total > 0) {
      throw new Error("Category has linked menu items. Update those first.");
    }

    await prisma.$executeRaw`
      DELETE FROM "PizzaCategory"
      WHERE "id" = ${parsedId}::uuid
    `;

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/search");

    return {
      success: true,
      message: "Pizza category deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
