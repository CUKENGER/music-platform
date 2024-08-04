import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AlbumModule } from './album/album.module';
import { Album } from './album/album.schema';
import { AlbumComment } from './album/commentAlbum/albumComment.schema';
import { ArtistModule } from './artist/artist.module';
import { ArtistComment } from './artist/artistComment/artistComment.schema';
import { Artist } from './artist/scheme/artist.schema';
import { AuthModule } from './auth/auth.module';
import { MailService } from './auth/mail.service';
import { FileModule } from './file/file.module';
import { LyricsController } from './lyrics/lyrics.controller';
import { LyricsService } from './lyrics/lyrics.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ErrorMiddleware } from './middleware/error.middleware';
import { RoleModule } from './role/role.module';
import { Track } from './track/scheme/track.schema';
import { TrackComment } from './track/scheme/trackComment.schema';
import { TrackReplyComment } from './track/scheme/trackReplyComment.schema';
import { TrackModule } from './track/track.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { Token } from './token/token.model';
import { User } from './user/user.model';
import { Role } from './role/role.model';
import { UserRole } from './role/userRole.model';

@Module({
  imports: [
    HttpModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Track,
        Album,
        AlbumComment,
        Artist,
        ArtistComment,
        TrackComment,
        TrackReplyComment,
        Token,
        User,
        Role,
        UserRole
      ],
      synchronize: true,
    }),
    TrackModule,
    FileModule,
    AlbumModule,
    ArtistModule,
    UserModule,
    RoleModule,
    AuthModule,
    TokenModule,
  ],
  controllers: [LyricsController],
  providers: [LyricsService, MailService],
  exports: [ MailService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ErrorMiddleware, AuthMiddleware)
      .forRoutes('*');
  }
}
