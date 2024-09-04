-- CreateTable
CREATE TABLE "ListenedTrack" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,
    "listenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListenedTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LikedTracks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LikedAlbums" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LikedArtists" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ListenedTrack_userId_trackId_key" ON "ListenedTrack"("userId", "trackId");

-- CreateIndex
CREATE UNIQUE INDEX "_LikedTracks_AB_unique" ON "_LikedTracks"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedTracks_B_index" ON "_LikedTracks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LikedAlbums_AB_unique" ON "_LikedAlbums"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedAlbums_B_index" ON "_LikedAlbums"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LikedArtists_AB_unique" ON "_LikedArtists"("A", "B");

-- CreateIndex
CREATE INDEX "_LikedArtists_B_index" ON "_LikedArtists"("B");

-- AddForeignKey
ALTER TABLE "ListenedTrack" ADD CONSTRAINT "ListenedTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListenedTrack" ADD CONSTRAINT "ListenedTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedTracks" ADD CONSTRAINT "_LikedTracks_A_fkey" FOREIGN KEY ("A") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedTracks" ADD CONSTRAINT "_LikedTracks_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedAlbums" ADD CONSTRAINT "_LikedAlbums_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedAlbums" ADD CONSTRAINT "_LikedAlbums_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedArtists" ADD CONSTRAINT "_LikedArtists_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikedArtists" ADD CONSTRAINT "_LikedArtists_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
