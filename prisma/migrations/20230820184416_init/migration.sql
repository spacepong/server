/*
  Warnings:

  - The primary key for the `avatars` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `connections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `matches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[intra_42]` on the table `connections` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "avatars" DROP CONSTRAINT "avatars_userId_fkey";

-- DropForeignKey
ALTER TABLE "connections" DROP CONSTRAINT "connections_userId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_loserId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_winnerId_fkey";

-- AlterTable
ALTER TABLE "avatars" DROP CONSTRAINT "avatars_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "avatars_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "avatars_id_seq";

-- AlterTable
ALTER TABLE "connections" DROP CONSTRAINT "connections_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "connections_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "connections_id_seq";

-- AlterTable
ALTER TABLE "matches" DROP CONSTRAINT "matches_pkey",
ADD COLUMN     "score" INTEGER[] DEFAULT ARRAY[0, 0]::INTEGER[],
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "winnerId" SET DATA TYPE TEXT,
ALTER COLUMN "loserId" SET DATA TYPE TEXT,
ADD CONSTRAINT "matches_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "matches_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ADD COLUMN     "blocked" TEXT[],
ADD COLUMN     "followed" TEXT[],
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'ONLINE',
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "connections_intra_42_key" ON "connections"("intra_42");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avatars" ADD CONSTRAINT "avatars_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
