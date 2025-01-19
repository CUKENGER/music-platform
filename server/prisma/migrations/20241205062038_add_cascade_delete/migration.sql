-- DropForeignKey
ALTER TABLE "ListenedTrack" DROP CONSTRAINT "ListenedTrack_trackId_fkey";

-- DropForeignKey
ALTER TABLE "ListenedTrack" DROP CONSTRAINT "ListenedTrack_userId_fkey";

-- AddForeignKey
ALTER TABLE "ListenedTrack" ADD CONSTRAINT "ListenedTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListenedTrack" ADD CONSTRAINT "ListenedTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
