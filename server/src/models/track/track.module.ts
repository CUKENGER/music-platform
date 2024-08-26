import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { PrismaService } from 'prisma/prisma.service';
import { FileService } from 'models/file/file.service';
import { FileModule } from 'models/file/file.module';
import { AudioService } from 'models/audioService/audioService.service';
import { ArtistService } from 'models/artist/artist.service';
import { CommentService } from 'models/comment/comment.service';
import { ArtistFileModule } from 'models/artist/artistFile/artistFile.module';

@Module({
  imports: [FileModule, ArtistFileModule],
  controllers: [TrackController],
  providers: [
    TrackService, 
    PrismaService, 
    FileService,
    AudioService,
    ArtistService,
    CommentService
  ],
  exports: [TrackService]
})
export class TrackModule {}
