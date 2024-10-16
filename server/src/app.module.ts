import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { AuthMiddleware } from 'middleware/auth.middleware';
import { AuthModule } from 'models/auth/auth.module';
import { AlbumModule } from 'models/album/album.module';
import { ArtistModule } from 'models/artist/artist.module';
import { CommentModule } from 'models/comment/comment.module';
import { RoleModule } from 'models/role/role.module';
import { TokenModule } from 'models/token/token.module';
import { TrackModule } from 'models/track/track.module';
import { UserModule } from 'models/user/user.module';
import { ArtistFileModule } from 'models/artist/artistFile/artistFile.module';
import { AlbumFileModule } from 'models/album/albumFile/albumFile.module';
import { LyricsModule } from 'models/lyrics/lyrics.module';
import { HttpModule} from '@nestjs/axios';
import { FileModule } from 'models/file/file.module';
import { AudioModule } from 'models/audioService/audioService.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..','static'),
    }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET_KEY,
      signOptions: {expiresIn: '24h'}
    }),
    PrismaModule,
    AuthModule,
    AlbumModule,
    ArtistModule,
    CommentModule,
    RoleModule,
    TokenModule,
    TrackModule,
    UserModule,
    ArtistFileModule,
    AlbumFileModule,
    LyricsModule,
    HttpModule,
    FileModule,
    AudioModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/activate/:link', method: RequestMethod.GET },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/registration', method: RequestMethod.POST },
        { path: 'auth/send_email', method: RequestMethod.ALL },
        { path: 'auth/reset_password', method: RequestMethod.ALL },
        { path: 'user/check/:username', method: RequestMethod.POST },
        { path: 'user', method: RequestMethod.POST },
        { path: 'image/(.*)', method: RequestMethod.ALL},
        { path: 'audio/(.*)', method: RequestMethod.ALL},
        { path: 'static/*', method: RequestMethod.ALL},
        { path: '.favicon.ico', method: RequestMethod.GET }
      )
      .forRoutes(
        { path: '*', method: RequestMethod.ALL }
      )
  }
}