/*
  Warnings:

  - You are about to drop the column `category` on the `Partner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "category",
ADD COLUMN     "categoryLegacy" TEXT;
