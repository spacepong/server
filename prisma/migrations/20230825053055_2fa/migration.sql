/*
  Warnings:

  - You are about to drop the column `email` on the `connections` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `connections` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `connections` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "connections_email_key";

-- AlterTable
ALTER TABLE "connections" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "refreshToken",
ADD COLUMN     "is2faEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpCreatedAt" TIMESTAMP(3);
