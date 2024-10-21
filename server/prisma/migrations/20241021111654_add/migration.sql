-- CreateEnum
CREATE TYPE "AlbumType" AS ENUM ('ALBUM', 'SINGLE');

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "type" "AlbumType" NOT NULL DEFAULT 'ALBUM';
