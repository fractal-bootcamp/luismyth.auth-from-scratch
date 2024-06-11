/*
  Warnings:

  - A unique constraint covering the columns `[currentSessionToken]` on the table `webuser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "webuser_currentSessionToken_key" ON "webuser"("currentSessionToken");
