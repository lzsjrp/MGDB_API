/*
  Warnings:

  - You are about to drop the `Manga` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MangaChapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MangaChapterPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NovelChapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NovelVolume` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TitleCover` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebNovel` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TitleType" AS ENUM ('MANGA', 'WEB_NOVEL');

-- DropForeignKey
ALTER TABLE "public"."MangaChapter" DROP CONSTRAINT "MangaChapter_mangaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MangaChapterPage" DROP CONSTRAINT "MangaChapterPage_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NovelChapter" DROP CONSTRAINT "NovelChapter_volumeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."NovelVolume" DROP CONSTRAINT "NovelVolume_webNovelId_fkey";

-- DropTable
DROP TABLE "public"."Manga";

-- DropTable
DROP TABLE "public"."MangaChapter";

-- DropTable
DROP TABLE "public"."MangaChapterPage";

-- DropTable
DROP TABLE "public"."NovelChapter";

-- DropTable
DROP TABLE "public"."NovelVolume";

-- DropTable
DROP TABLE "public"."TitleCover";

-- DropTable
DROP TABLE "public"."WebNovel";

-- CreateTable
CREATE TABLE "public"."Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."TitleType" NOT NULL,
    "status" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "genre" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookVolume" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookVolume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookChapter" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "volumeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "content" TEXT,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ImageChapter" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookCover" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookCover_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookVolume_bookId_key" ON "public"."BookVolume"("bookId");

-- CreateIndex
CREATE INDEX "BookVolume_bookId_idx" ON "public"."BookVolume"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "BookChapter_bookId_key" ON "public"."BookChapter"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "BookChapter_volumeId_key" ON "public"."BookChapter"("volumeId");

-- CreateIndex
CREATE INDEX "BookChapter_volumeId_idx" ON "public"."BookChapter"("volumeId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageChapter_bookId_key" ON "public"."ImageChapter"("bookId");

-- CreateIndex
CREATE INDEX "ImageChapter_chapterId_idx" ON "public"."ImageChapter"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "BookCover_bookId_key" ON "public"."BookCover"("bookId");

-- CreateIndex
CREATE INDEX "BookCover_bookId_idx" ON "public"."BookCover"("bookId");

-- AddForeignKey
ALTER TABLE "public"."BookVolume" ADD CONSTRAINT "BookVolume_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "public"."Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookChapter" ADD CONSTRAINT "BookChapter_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "public"."BookVolume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImageChapter" ADD CONSTRAINT "ImageChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "public"."BookChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImageChapter" ADD CONSTRAINT "ImageChapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "public"."Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookCover" ADD CONSTRAINT "BookCover_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "public"."Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
