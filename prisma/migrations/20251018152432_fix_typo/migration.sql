/*
  Warnings:

  - You are about to drop the column `languague` on the `BookChapter` table. All the data in the column will be lost.
  - Added the required column `language` to the `BookChapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookChapter" DROP COLUMN "languague",
ADD COLUMN     "language" TEXT NOT NULL;
