/*
  Warnings:

  - You are about to drop the `MangaCover` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NovelCover` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MangaCover" DROP CONSTRAINT "MangaCover_mangaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NovelCover" DROP CONSTRAINT "NovelCover_webNovelId_fkey";

-- DropTable
DROP TABLE "public"."MangaCover";

-- DropTable
DROP TABLE "public"."NovelCover";

-- CreateTable
CREATE TABLE "public"."TitleCover" (
    "id" TEXT NOT NULL,
    "titleId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TitleCover_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TitleCover_titleId_key" ON "public"."TitleCover"("titleId");
