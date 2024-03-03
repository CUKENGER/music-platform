import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { Track } from './scheme/track.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Comment} from './scheme/comment.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Track, Comment])],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
