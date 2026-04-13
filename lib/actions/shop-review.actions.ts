"use server";

import z from "zod";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { converToPlainObject, formatError } from "../utils";
import { insertShopReviewSchema } from "../validators";

type ShopReviewSummaryRow = {
  averageRating: number | string | null;
  totalReviews: number;
};

export type ShopReviewWithUser = {
  id: string;
  userId: string;
  title: string;
  description: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  userName: string | null;
};

async function ensureShopReviewTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ShopReview" (
      "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" UUID NOT NULL,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "rating" INTEGER NOT NULL CHECK ("rating" BETWEEN 1 AND 5),
      "createdAt" TIMESTAMP(6) NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT NOW()
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "ShopReview_userId_key"
    ON "ShopReview" ("userId")
  `);
}

export async function createOrUpdateShopReview(
  data: z.infer<typeof insertShopReviewSchema>
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User is not authenticated");
    }

    await ensureShopReviewTable();

    const review = insertShopReviewSchema.parse(data);

    const existingReview = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id"
      FROM "ShopReview"
      WHERE "userId" = ${session.user.id}::uuid
      LIMIT 1
    `;

    if (existingReview.length > 0) {
      await prisma.$executeRaw`
        UPDATE "ShopReview"
        SET
          "title" = ${review.title},
          "description" = ${review.description},
          "rating" = ${review.rating},
          "updatedAt" = NOW()
        WHERE "id" = ${existingReview[0].id}::uuid
      `;
    } else {
      await prisma.$executeRaw`
        INSERT INTO "ShopReview" ("userId", "title", "description", "rating", "updatedAt")
        VALUES (
          ${session.user.id}::uuid,
          ${review.title},
          ${review.description},
          ${review.rating},
          NOW()
        )
      `;
    }

    revalidatePath("/");
    revalidatePath("/about-us");

    return {
      success: true,
      message: "Shop review submitted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getShopReviews({ limit }: { limit?: number } = {}) {
  await ensureShopReviewTable();

  const limitClause =
    typeof limit === "number" ? Prisma.sql`LIMIT ${limit}` : Prisma.empty;

  const rows = await prisma.$queryRaw<ShopReviewWithUser[]>(Prisma.sql`
    SELECT
      sr."id",
      sr."userId",
      sr."title",
      sr."description",
      sr."rating",
      sr."createdAt",
      sr."updatedAt",
      u."name" as "userName"
    FROM "ShopReview" sr
    LEFT JOIN "User" u ON u."id" = sr."userId"
    ORDER BY sr."updatedAt" DESC
    ${limitClause}
  `);

  return {
    data: converToPlainObject(rows),
  };
}

export async function getMyShopReview() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("User is not authenticated");

  await ensureShopReviewTable();

  const rows = await prisma.$queryRaw<ShopReviewWithUser[]>`
    SELECT
      sr."id",
      sr."userId",
      sr."title",
      sr."description",
      sr."rating",
      sr."createdAt",
      sr."updatedAt",
      u."name" as "userName"
    FROM "ShopReview" sr
    LEFT JOIN "User" u ON u."id" = sr."userId"
    WHERE sr."userId" = ${session.user.id}::uuid
    LIMIT 1
  `;

  return rows[0] ? converToPlainObject(rows[0]) : null;
}

export async function getShopRatingSummary() {
  await ensureShopReviewTable();

  const summary = await prisma.$queryRaw<ShopReviewSummaryRow[]>`
    SELECT
      ROUND(AVG("rating")::numeric, 2) as "averageRating",
      COUNT(*)::int as "totalReviews"
    FROM "ShopReview"
  `;

  const first = summary[0];

  return {
    averageRating: first?.averageRating ? Number(first.averageRating) : 0,
    totalReviews: first?.totalReviews ?? 0,
  };
}
