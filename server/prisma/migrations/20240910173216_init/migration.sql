/*
  Warnings:

  - You are about to drop the column `releaseData` on the `Album` table. All the data in the column will be lost.
  - Added the required column `releaseDate` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "releaseData",
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL;
