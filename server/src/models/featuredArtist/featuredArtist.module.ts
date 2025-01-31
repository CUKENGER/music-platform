import { Module } from "@nestjs/common";
import { FeaturedArtistService } from "./featuredArtist.service";
import { FeaturedArtistRepository } from "./featuredArtist.repository";
import { ArtistModule } from "models/artist/artist.module";
import { FeaturedArtistPublicService } from "./featuredArtistPublic.service";

@Module({
  imports: [
    ArtistModule,
  ],
  controllers: [],
  providers: [FeaturedArtistService, FeaturedArtistRepository, FeaturedArtistPublicService],
  exports: [FeaturedArtistPublicService],
})
export class FeaturedArtistModule {}
