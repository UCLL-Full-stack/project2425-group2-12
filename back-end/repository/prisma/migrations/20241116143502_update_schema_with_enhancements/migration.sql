-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Scheduled';

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "email" TEXT;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "Spectator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Spectator_pkey" PRIMARY KEY ("id")
);
