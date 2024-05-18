import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { LoggingMiddleware } from './middleware/appMiddleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './middleware/appInterceptor';
import { ArtistComment } from './artist/artistComment/artistComment.schema';
import { Artist } from './artist/scheme/artist.schema';
import { ArtistModule } from './artist/artist.module';

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
      entities: [Track, Album, Comment, AlbumComment, Artist, ArtistComment],
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
    ArtistModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*'); // Apply middleware to all routes
  
    // You can also apply middleware to specific routes
  
    // Apply interceptor globally
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useClass: LoggingInterceptor,
      },
    ];
  }
}
