"use server";

import { prisma } from "@/db/prisma";
import { converToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import {
  insertPromotionSchema,
  promotionPlacementSchema,
  promotionTypeSchema,
  updatePromotionSchema,
} from "../validators";
import z from "zod";

type PromotionType = z.infer<typeof promotionTypeSchema>;
type PromotionPlacement = z.infer<typeof promotionPlacementSchema>;

export type PromotionRecord = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  type: PromotionType;
  placement: PromotionPlacement;
  priority: number;
  isActive: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

async function ensurePromotionTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Promotion" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "title" TEXT NOT NULL,
      "subtitle" TEXT,
      "description" TEXT,
      "imageUrl" TEXT,
      "ctaLabel" TEXT,
      "ctaUrl" TEXT,
      "type" TEXT NOT NULL CHECK ("type" IN ('OFFER', 'ADVERTISEMENT')),
      "placement" TEXT NOT NULL DEFAULT 'BOTH' CHECK ("placement" IN ('HOME', 'OFFERS', 'BOTH')),
      "priority" INTEGER NOT NULL DEFAULT 0,
      "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
      "startsAt" TIMESTAMP(6),
      "endsAt" TIMESTAMP(6),
      "createdAt" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
      CHECK ("endsAt" IS NULL OR "startsAt" IS NULL OR "endsAt" > "startsAt")
    )
  `);
}

function normalizeOptional(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizePromotionInput(data: z.infer<typeof insertPromotionSchema>) {
  return {
    ...data,
    title: data.title.trim(),
    subtitle: normalizeOptional(data.subtitle),
    description: normalizeOptional(data.description),
    imageUrl: normalizeOptional(data.imageUrl),
    ctaLabel: normalizeOptional(data.ctaLabel),
    ctaUrl: normalizeOptional(data.ctaUrl),
  };
}

export async function getAllPromotionsForAdmin() {
  await ensurePromotionTable();

  const rows = await prisma.$queryRaw<PromotionRecord[]>`
    SELECT
      "id",
      "title",
      "subtitle",
      "description",
      "imageUrl",
      "ctaLabel",
      "ctaUrl",
      "type",
      "placement",
      "priority",
      "isActive",
      "startsAt",
      "endsAt",
      "createdAt",
      "updatedAt"
    FROM "Promotion"
    ORDER BY "priority" DESC, "updatedAt" DESC
  `;

  return converToPlainObject(rows);
}

export async function getActivePromotions({
  placement,
  type,
  limit,
}: {
  placement?: PromotionPlacement;
  type?: PromotionType;
  limit?: number;
} = {}) {
  await ensurePromotionTable();

  const placementFilter = placement
    ? Prisma.sql`AND ("placement" = ${placement} OR "placement" = 'BOTH')`
    : Prisma.empty;
  const typeFilter = type ? Prisma.sql`AND "type" = ${type}` : Prisma.empty;
  const limitClause =
    typeof limit === "number" ? Prisma.sql`LIMIT ${limit}` : Prisma.empty;

  const rows = await prisma.$queryRaw<PromotionRecord[]>(Prisma.sql`
    SELECT
      "id",
      "title",
      "subtitle",
      "description",
      "imageUrl",
      "ctaLabel",
      "ctaUrl",
      "type",
      "placement",
      "priority",
      "isActive",
      "startsAt",
      "endsAt",
      "createdAt",
      "updatedAt"
    FROM "Promotion"
    WHERE "isActive" = TRUE
      AND ("startsAt" IS NULL OR "startsAt" <= NOW())
      AND ("endsAt" IS NULL OR "endsAt" >= NOW())
      ${placementFilter}
      ${typeFilter}
    ORDER BY "priority" DESC, "updatedAt" DESC
    ${limitClause}
  `);

  return converToPlainObject(rows);
}

export async function createPromotion(
  data: z.infer<typeof insertPromotionSchema>
) {
  try {
    await ensurePromotionTable();

    const parsed = insertPromotionSchema.parse(normalizePromotionInput(data));

    await prisma.$executeRaw`
      INSERT INTO "Promotion" (
        "title",
        "subtitle",
        "description",
        "imageUrl",
        "ctaLabel",
        "ctaUrl",
        "type",
        "placement",
        "priority",
        "isActive",
        "startsAt",
        "endsAt"
      )
      VALUES (
        ${parsed.title},
        ${parsed.subtitle},
        ${parsed.description},
        ${parsed.imageUrl},
        ${parsed.ctaLabel},
        ${parsed.ctaUrl},
        ${parsed.type},
        ${parsed.placement},
        ${parsed.priority},
        ${parsed.isActive},
        ${parsed.startsAt},
        ${parsed.endsAt}
      )
    `;

    revalidatePath("/");
    revalidatePath("/offers");
    revalidatePath("/admin/promotions");

    return {
      success: true,
      message: "Promotion created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updatePromotion(
  data: z.infer<typeof updatePromotionSchema>
) {
  try {
    await ensurePromotionTable();

    const parsed = updatePromotionSchema.parse(normalizePromotionInput(data));

    const exists = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id"
      FROM "Promotion"
      WHERE "id" = ${parsed.id}::uuid
      LIMIT 1
    `;

    if (!exists.length) {
      throw new Error("Promotion not found");
    }

    await prisma.$executeRaw`
      UPDATE "Promotion"
      SET
        "title" = ${parsed.title},
        "subtitle" = ${parsed.subtitle},
        "description" = ${parsed.description},
        "imageUrl" = ${parsed.imageUrl},
        "ctaLabel" = ${parsed.ctaLabel},
        "ctaUrl" = ${parsed.ctaUrl},
        "type" = ${parsed.type},
        "placement" = ${parsed.placement},
        "priority" = ${parsed.priority},
        "isActive" = ${parsed.isActive},
        "startsAt" = ${parsed.startsAt},
        "endsAt" = ${parsed.endsAt},
        "updatedAt" = NOW()
      WHERE "id" = ${parsed.id}::uuid
    `;

    revalidatePath("/");
    revalidatePath("/offers");
    revalidatePath("/admin/promotions");

    return {
      success: true,
      message: "Promotion updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function deletePromotion(id: string) {
  try {
    await ensurePromotionTable();
    const parsedId = z.string().uuid("Invalid promotion id").parse(id);

    await prisma.$executeRaw`
      DELETE FROM "Promotion"
      WHERE "id" = ${parsedId}::uuid
    `;

    revalidatePath("/");
    revalidatePath("/offers");
    revalidatePath("/admin/promotions");

    return {
      success: true,
      message: "Promotion deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
