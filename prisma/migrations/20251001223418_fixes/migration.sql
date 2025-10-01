/*
  Warnings:

  - Added the required column `webNovelId` to the `NovelChapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."NovelChapter" ADD COLUMN     "webNovelId" TEXT NOT NULL;
