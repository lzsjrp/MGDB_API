-- AlterTable
ALTER TABLE "BookChapter" ADD COLUMN     "scanlatorId" TEXT;

-- CreateTable
CREATE TABLE "Scanlator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "discord" TEXT,
    "twitter" TEXT,
    "languages" TEXT[],
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scanlator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scanlator_name_key" ON "Scanlator"("name");

-- AddForeignKey
ALTER TABLE "BookChapter" ADD CONSTRAINT "BookChapter_scanlatorId_fkey" FOREIGN KEY ("scanlatorId") REFERENCES "Scanlator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
