-- CreateTable
CREATE TABLE "UserFavorites" (
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "UserFavorites_pkey" PRIMARY KEY ("userId","bookId")
);

-- CreateIndex
CREATE INDEX "UserFavorites_userId_idx" ON "UserFavorites"("userId");

-- CreateIndex
CREATE INDEX "UserFavorites_bookId_idx" ON "UserFavorites"("bookId");

-- AddForeignKey
ALTER TABLE "UserFavorites" ADD CONSTRAINT "UserFavorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorites" ADD CONSTRAINT "UserFavorites_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
