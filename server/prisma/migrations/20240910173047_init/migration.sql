/*
  Warnings:

  - Added the required column `releaseData` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "releaseData" TIMESTAMP(3) NOT NULL;
