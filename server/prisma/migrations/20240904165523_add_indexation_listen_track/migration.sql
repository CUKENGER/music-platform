-- DropIndex
DROP INDEX "ListenedTrack_userId_trackId_key";

-- CreateIndex
CREATE INDEX "ListenedTrack_userId_trackId_idx" ON "ListenedTrack"("userId", "trackId");
