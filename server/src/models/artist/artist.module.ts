import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { PrismaService } from 'prisma/prisma.service';
import { FileService } from 'models/file/file.service';

@Module({
  imports: [],
  controllers: [ArtistController],
  providers: [ArtistService, PrismaService, FileService],
  exports: [ArtistService],
})
export class ArtistModule {}
