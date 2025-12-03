/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "AllowedIP" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "AllowedIP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedIP" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "BlockedIP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AllowedIP_ip_key" ON "AllowedIP"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedIP_ip_key" ON "BlockedIP"("ip");
