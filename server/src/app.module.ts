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
import { LyricsModule } from 'models/lyrics/lyrics.module';
import { HttpModule } from '@nestjs/axios';
import { FileModule } from 'models/file/file.module';
import { AudioModule } from 'models/audioService/audioService.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { AudioController } from 'models/audio/audio.controller';
import { PlaylistModule } from 'models/playlist/playlist.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCleanupService } from 'models/user/user-cleanup.service';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'exceptions/allExceptionFilter';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
    }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET_KEY,
      signOptions: { expiresIn: '24h' },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                colorizerFactory: true,
                translateTime: 'HH:MM:ss.l',
                ignore: 'pid,hostname',
                // singleLine: true,
              }
            },
            { target: 'pino/file', options: { destination: path.resolve(__dirname, '..', 'logs/app.log') }, level: 'debug' },
          ]
        },
        level: 'debug',
        customSuccessMessage: (req, res) => `✅ ${req.method} ${req.url} - ${res.statusCode}`,
        customErrorMessage: (req, res, err) => `❌ ${req.method} ${req.url} - ${err.message}`,
        customAttributeKeys: {
          req: 'request',
          res: 'response',
          err: 'error',
        },
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              // headers: req.headers,
              // body: req.raw.body,
            };
          },
          res(res) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
        redact: ['req.headers.authorization'],
      },
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
    LyricsModule,
    HttpModule,
    FileModule,
    AudioModule,
    PlaylistModule,
  ],
  controllers: [AudioController],
  providers: [UserCleanupService, { provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule implements NestModule {
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
        { path: 'image/(.*)', method: RequestMethod.ALL },
        { path: 'audio/(.*)', method: RequestMethod.ALL },
        { path: 'static/*', method: RequestMethod.ALL },
        { path: '.favicon.ico', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
