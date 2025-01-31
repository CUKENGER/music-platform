import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { PrismaService } from 'prisma/prisma.service';
import { AddTrackToPlaylistDto } from './dto/add-track-playlist.dto';
import { Logger } from 'nestjs-pino';
import { UserPublicService } from 'models/user/userPublic.service';

@Injectable()
export class PlaylistService {
  constructor(
    private prisma: PrismaService,
    private userPublicService: UserPublicService,
    private readonly logger: Logger,
  ) {}

  async create(token: string, dto: CreatePlaylistDto): Promise<void> {
    const user = await this.userPublicService.getByToken(token);
    this.logger.log(`PlaylistService create dto: ${dto}, userId: ${user.id}`);
  }

  async addTrackToPlaylist(dto: AddTrackToPlaylistDto, files: File[]): Promise<void> {
    const playlistTrack = await this.prisma.playlistTrack.create({
      data: {
        ...dto,
        order: dto.order || 0,
      },
    });
    this.logger.log(`PlaylistService addTrackToPlaylist playlistTrack: ${playlistTrack}`, {playlistTrack: playlistTrack});
    this.logger.log(`PlaylistService addTrackToPlaylist files: ${files}`);
  }

  // async getAll(page, count, sortBy) {}
}
