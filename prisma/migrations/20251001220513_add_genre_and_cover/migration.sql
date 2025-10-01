-- AlterTable
ALTER TABLE "public"."Manga" ADD COLUMN     "genre" TEXT[];

-- AlterTable
ALTER TABLE "public"."WebNovel" ADD COLUMN     "genre" TEXT[];

-- CreateTable
CREATE TABLE "public"."MangaCover" (
    "id" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MangaCover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NovelCover" (
    "id" TEXT NOT NULL,
    "webNovelId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NovelCover_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MangaCover_mangaId_idx" ON "public"."MangaCover"("mangaId");

-- CreateIndex
CREATE INDEX "NovelCover_webNovelId_idx" ON "public"."NovelCover"("webNovelId");

-- AddForeignKey
ALTER TABLE "public"."MangaCover" ADD CONSTRAINT "MangaCover_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "public"."Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NovelCover" ADD CONSTRAINT "NovelCover_webNovelId_fkey" FOREIGN KEY ("webNovelId") REFERENCES "public"."WebNovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
