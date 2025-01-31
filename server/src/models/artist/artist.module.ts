import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { PrismaService } from 'prisma/prisma.service';
import { FileService } from 'models/file/file.service';
import { ArtistRepository } from './artist.repository';
import { ArtistPublicService } from './artist.public';
import { CommentModule } from 'models/comment/comment.module';

@Module({
  imports: [CommentModule],
  controllers: [ArtistController],
  providers: [
    PrismaService, 
    FileService, 
    ArtistRepository, 
    ArtistService, 
    ArtistPublicService, 
  ],
  exports: [
    ArtistPublicService
  ],
})
export class ArtistModule {}
