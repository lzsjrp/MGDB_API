/*
  Warnings:

  - You are about to drop the `Chapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChapterPage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Chapter" DROP CONSTRAINT "Chapter_mangaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ChapterPage" DROP CONSTRAINT "ChapterPage_chapterId_fkey";

-- DropTable
DROP TABLE "public"."Chapter";

-- DropTable
DROP TABLE "public"."ChapterPage";

-- CreateTable
CREATE TABLE "public"."MangaChapter" (
    "id" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "pagesCount" INTEGER NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MangaChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MangaChapterPage" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MangaChapterPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebNovel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebNovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NovelVolume" (
    "id" TEXT NOT NULL,
    "webNovelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NovelVolume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NovelChapter" (
    "id" TEXT NOT NULL,
    "volumeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NovelChapter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MangaChapter_mangaId_idx" ON "public"."MangaChapter"("mangaId");

-- CreateIndex
CREATE INDEX "MangaChapterPage_chapterId_idx" ON "public"."MangaChapterPage"("chapterId");

-- CreateIndex
CREATE INDEX "NovelVolume_webNovelId_idx" ON "public"."NovelVolume"("webNovelId");

-- CreateIndex
CREATE INDEX "NovelChapter_volumeId_idx" ON "public"."NovelChapter"("volumeId");

-- AddForeignKey
ALTER TABLE "public"."MangaChapter" ADD CONSTRAINT "MangaChapter_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "public"."Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MangaChapterPage" ADD CONSTRAINT "MangaChapterPage_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "public"."MangaChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NovelVolume" ADD CONSTRAINT "NovelVolume_webNovelId_fkey" FOREIGN KEY ("webNovelId") REFERENCES "public"."WebNovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NovelChapter" ADD CONSTRAINT "NovelChapter_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "public"."NovelVolume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
