import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Album } from "./album.schema";
import { AlbumController } from "./album.controller";
import { AlbumService } from "./album.service";
import { AlbumComment } from "./commentAlbum/albumComment.schema";
import { ConfigModule } from "@nestjs/config";
import { AlbumFileService } from "./albumFile/albumFile.service";
import { Track } from "src/track/scheme/track.schema";


@Module({
    imports: [TypeOrmModule.forFeature([Album, AlbumComment, Track]), ConfigModule],
    controllers: [AlbumController],
    providers: [AlbumService, AlbumFileService]
})
export class AlbumModule {}