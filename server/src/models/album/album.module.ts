import { Module } from "@nestjs/common";
import { AlbumController } from "./album.controller";
import { AlbumService } from "./album.service";
import { PrismaService } from "prisma/prisma.service";
import { ArtistService } from "models/artist/artist.service";
import { AudioService } from "models/audioService/audioService.service";
import { CommentService } from "models/comment/comment.service";
import { AlbumHelperService } from "./albumHelper.service";
import { UserService } from "models/user/user.service";
import { RoleService } from "models/role/role.service";
import { JwtService } from "@nestjs/jwt";
import { FileService } from "models/file/file.service";
import { TrackService } from "models/track/track.service";
import { TrackHelperService } from "models/track/trackHelper.service";

@Module({
    imports: [],
    controllers: [AlbumController],
    providers: [
        PrismaService, 
        AlbumService,
        ArtistService, 
        AudioService, 
        CommentService,
        AlbumHelperService,
        UserService,
        RoleService,
        JwtService,
        FileService,
        TrackService,
        TrackHelperService,
        AudioService
    ]
})
export class AlbumModule {}