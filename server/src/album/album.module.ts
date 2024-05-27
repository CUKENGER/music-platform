import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Album } from "./album.schema";
import { AlbumController } from "./album.controller";
import { AlbumService } from "./album.service";
import { AlbumComment } from "./commentAlbum/albumComment.schema";
import { ConfigModule } from "@nestjs/config";
import { AlbumFileService } from "./albumFile/albumFile.service";
import { Track } from "src/track/scheme/track.schema";
import { Artist } from "src/artist/scheme/artist.schema";
import { ArtistService } from "src/artist/artist.service";
import { ArtistComment } from "src/artist/artistComment/artistComment.schema";
import { ArtistFileService } from "src/artist/artistFile/artistFile.service";
import { AudioService } from "src/audioService/audioService.service";


@Module({
    imports: [TypeOrmModule.forFeature([Album, AlbumComment, Track, Artist, ArtistComment]), ConfigModule],
    controllers: [AlbumController],
    providers: [AlbumService, AlbumFileService, ArtistService, ArtistFileService, AudioService]
})
export class AlbumModule {}