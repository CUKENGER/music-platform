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

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET_KEY,
      signOptions: {expiresIn: '24h'}
    }),
    PrismaModule,
    AuthModule,
    AlbumModule,
    ArtistModule,
    AuthModule,
    CommentModule,
    RoleModule,
    TokenModule,
    TrackModule,
    UserModule,
    ArtistFileModule,
    AlbumFileModule
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
        { path: 'user/check/:username', method: RequestMethod.POST },
        { path: 'user', method: RequestMethod.POST },
      )
      .forRoutes(
        { path: '*', method: RequestMethod.ALL }
      )
  }
}