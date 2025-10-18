/*
  Warnings:

  - Added the required column `languague` to the `BookChapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookChapter" ADD COLUMN     "languague" TEXT NOT NULL;
