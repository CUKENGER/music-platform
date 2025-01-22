import { forwardRef, Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'models/user/user.service';
import { RoleModule } from 'models/role/role.module';
import { AuthModule } from 'models/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, PrismaService, UserService, JwtService],
  imports: [
    forwardRef(() => RoleModule), // Упомяните AuthModule здесь, если RoleModule зависит от него
    AuthModule,
  ],
  exports: [],
})
export class PlaylistModule {}
