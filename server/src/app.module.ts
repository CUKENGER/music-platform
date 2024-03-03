import { Module } from '@nestjs/common';
import { Track } from './track/scheme/track.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Comment} from './track/scheme/comment.schema';
import { TrackModule } from './track/track.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../db/music.db',
      entities: [Track, Comment],
      synchronize: true,
    }),
    TrackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
