import { Module } from '@nestjs/common';
import { Track } from './track/scheme/track.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Comment} from './track/scheme/comment.schema';
import { TrackModule } from './track/track.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { MulterModule } from '@nestjs/platform-express/multer';
import { Album } from './album/album.schema';
import { AlbumModule } from './album/album.module';
import { AlbumComment } from './album/commentAlbum/albumComment.schema';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..','static'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5001,
      username: 'postgres',
      password: '1234',
      database: 'music_platform',
      entities: [Track, Album, Comment, AlbumComment],
      synchronize: true,
    }),
    MulterModule.register({
      dest: './upload',
      limits: {
        fileSize: Infinity,
        fieldSize: Infinity,
      }
    }),
    TrackModule,
    FileModule,
    AlbumModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
