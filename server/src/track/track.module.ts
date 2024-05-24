import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { Track } from './scheme/track.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Comment} from './scheme/comment.schema';
import { FileService } from 'src/file/file.service';
import { ConfigModule } from '@nestjs/config';
import { Artist } from 'src/artist/scheme/artist.schema';
import { ArtistService } from 'src/artist/artist.service';
import { ArtistComment } from 'src/artist/artistComment/artistComment.schema';
import { ArtistFileService } from 'src/artist/artistFile/artistFile.service';
import { AudioService } from 'src/audioService/audioService.service';
import { Album } from 'src/album/album.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Comment, Artist, ArtistComment, Album]), ConfigModule],
  controllers: [TrackController],
  providers: [TrackService, FileService, ArtistService, ArtistFileService, AudioService],
})
export class TrackModule {}
