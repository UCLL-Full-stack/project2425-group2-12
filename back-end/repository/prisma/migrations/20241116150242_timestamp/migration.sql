/*
  Warnings:

  - You are about to drop the column `email` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Team` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participation" ALTER COLUMN "status" SET DEFAULT 'not confirmed';

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'reserved';

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "description";
