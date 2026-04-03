-- CreateEnum
CREATE TYPE "MenuItemType" AS ENUM ('PIZZA', 'PASTA', 'SIDE', 'DESSERT', 'BEVERAGE');

-- CreateEnum
CREATE TYPE "PizzaSize" AS ENUM ('PERSONAL', 'MEDIUM', 'LARGE', 'FAMILY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryZoneId" UUID,
ADD COLUMN     "estimatedDeliveryAt" TIMESTAMP(6),
ADD COLUMN     "kitchenNote" TEXT,
ADD COLUMN     "orderNote" TEXT,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" UUID,
ADD COLUMN     "isSpicy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "itemType" "MenuItemType" NOT NULL DEFAULT 'PIZZA',
ADD COLUMN     "menuTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "pizzaSize" "PizzaSize",
ADD COLUMN     "prepTimeMin" INTEGER NOT NULL DEFAULT 20;

-- CreateTable
CREATE TABLE "DeliveryZone" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "cityKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deliveryFee" DECIMAL(12,2) NOT NULL,
    "minEtaMinutes" INTEGER NOT NULL,
    "maxEtaMinutes" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopProfile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shopName" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Sri Lanka',
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "facebookUrl" TEXT,
    "googleMapUrl" TEXT,
    "mapEmbedUrl" TEXT,
    "opensAt" TEXT,
    "closesAt" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffNotification" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryZone_name_key" ON "DeliveryZone"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PizzaCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliveryZoneId_fkey" FOREIGN KEY ("deliveryZoneId") REFERENCES "DeliveryZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffNotification" ADD CONSTRAINT "StaffNotification_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
