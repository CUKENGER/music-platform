import { forwardRef, Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { PrismaService } from 'prisma/prisma.service';
import { RoleModule } from 'models/role/role.module';
import { AuthModule } from 'models/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'models/user/user.module';

@Module({
  controllers: [PlaylistController],
  providers: [
    PlaylistService, 
    PrismaService, 
    JwtService
  ],
  imports: [
    forwardRef(() => RoleModule),  
    AuthModule,
    UserModule
  ],
  exports: [],
})
export class PlaylistModule {}
