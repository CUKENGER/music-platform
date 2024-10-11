/*
  Warnings:

  - Made the column `duration` on table `Album` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "duration" SET DEFAULT '0:00',
ALTER COLUMN "duration" SET DATA TYPE TEXT;
