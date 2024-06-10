/*
  Warnings:

  - You are about to drop the `webuser2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "webuser2";

-- CreateTable
CREATE TABLE "webuser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "currentSessionToken" TEXT,
    "sessionExpiresAt" TIMESTAMP(3),
    "language" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "webuser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webuser_username_key" ON "webuser"("username");
