-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activationExpiresAt" TIMESTAMP(3);

-- RenameForeignKey
ALTER TABLE "FeaturedArtist" RENAME CONSTRAINT "FK_FeaturedArtist_ArtistForAlbums" TO "FK_FeaturedArtist_ArtistForTracks";

-- RenameForeignKey
ALTER TABLE "FeaturedArtist" RENAME CONSTRAINT "FK_FeaturedArtist_ArtistForTracks" TO "FK_FeaturedArtist_ArtistForAlbums";
