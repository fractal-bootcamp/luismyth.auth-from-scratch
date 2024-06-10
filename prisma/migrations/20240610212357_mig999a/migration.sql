/*
  Warnings:

  - You are about to drop the `webuser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "webuser";

-- CreateTable
CREATE TABLE "webuser2" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "currentSessionToken" TEXT NOT NULL,
    "sessionExpiresAt" TIMESTAMP(3) NOT NULL,
    "language" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "webuser2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webuser2_username_key" ON "webuser2"("username");
