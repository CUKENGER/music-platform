import { Injectable } from "@nestjs/common";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { PrismaService } from "prisma/prisma.service";
import { AddTrackToPlaylistDto } from "./dto/add-track-playlist.dto";
import { UserService } from "models/user/user.service";

@Injectable()
export class PlaylistService {

  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) { }

  async create(token: string, dto: CreatePlaylistDto) {
    const user = await this.userService.getByToken(token)
    const userId = user.id

  }

  async addTrackToPlaylist(dto: AddTrackToPlaylistDto, files): Promise<void> {
    await this.prisma.playlistTrack.create({
      data: {
        playlistId: dto.playlistId,
        trackId: dto.trackId,
        order: dto.order | 0
      }
    });
  }

  async getAll(page, count, sortBy) {

  }
}