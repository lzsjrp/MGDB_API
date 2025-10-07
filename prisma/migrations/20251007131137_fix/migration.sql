/*
  Warnings:

  - A unique constraint covering the columns `[bookId,number]` on the table `BookVolume` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookVolume_bookId_number_key" ON "BookVolume"("bookId", "number");
