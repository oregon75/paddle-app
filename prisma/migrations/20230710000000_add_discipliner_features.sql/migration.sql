-- AlterTable
ALTER TABLE "User" ADD COLUMN "disciplinerRole" "DisciplinerRole";

-- CreateEnum
CREATE TYPE "DisciplinerRole" AS ENUM ('DAD', 'SERGEANT', 'JUDGE');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN "intensity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "isEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "dueDate" TIMESTAMP(3),
ADD COLUMN "completionDate" TIMESTAMP(3),
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UnderwearAssignment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "underwear" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UnderwearAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChastityAssignment" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isTimerVisible" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChastityAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UnderwearAssignment" ADD CONSTRAINT "UnderwearAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChastityAssignment" ADD CONSTRAINT "ChastityAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "points" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL,
    "isRedeemed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Punishment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "severity" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Punishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetDate" TIMESTAMP(3),
    "isAchieved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "achievedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisciplinerImplement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "DisciplinerRole" NOT NULL,

    CONSTRAINT "DisciplinerImplement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Punishment" ADD CONSTRAINT "Punishment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;