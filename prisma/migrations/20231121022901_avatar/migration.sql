/*
  Warnings:

  - Added the required column `ingameFilename` to the `avatars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "avatars" ADD COLUMN     "ingameFilename" TEXT NOT NULL;
