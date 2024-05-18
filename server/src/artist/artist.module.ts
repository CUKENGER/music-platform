import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Artist } from "./scheme/artist.schema";
import { ArtistComment } from "./artistComment/artistComment.schema";
import { ConfigModule } from "@nestjs/config";
import { ArtistController } from "./artist.controller";
import { ArtistService } from "./artist.service";
import { ArtistFileService } from "./artistFile/artistFile.service";
import { Album } from "src/album/album.schema";
import { Track } from "src/track/scheme/track.schema";

@Module({
    imports: [TypeOrmModule.forFeature([Artist, ArtistComment, Album, Track]), ConfigModule],
    controllers: [ArtistController],
    providers: [ArtistService, ArtistFileService],
  })
  export class ArtistModule {}