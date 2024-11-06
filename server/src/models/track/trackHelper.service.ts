import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import * as fs from 'fs';
import * as path from 'path';
import { Track } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ArtistService } from "models/artist/artist.service";

@Injectable()
export class TrackHelperService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private artistService: ArtistService
  ) { }

  async getOrCreateArtist(name: string, genre: string, picture) {
    let artist = await this.prisma.artist.findFirst({
      where: { name: name },
      include: { tracks: true, albums: true },
    });

    if (!artist) {
      const artistDto = {
        name: name,
        genre: genre,
        description: '',
      };
      artist = await this.artistService.create(artistDto, picture);
    }
    return artist;
  }

  // to delete
  async findTrackById(id: number) {
    const track = await this.prisma.track.findFirst({ 
      where: { id: Number(id) } ,
      include: {
        likedByUsers: true,
        album: true,
        artist: true
      },
    });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  async deleteTrackFiles(track: Track): Promise<void> {
    if (track.picture) {
      const picturePath = path.resolve('static/', track.picture);
      console.log('picturePath', picturePath);
      
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      } else {
        console.log(`Файл с изображением не найден: ${picturePath}`);
      }
    }
  
    if (track.audio) {
      const audioPath = path.resolve('static/', track.audio);
      console.log('audioPath', audioPath);
  
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      } else {
        console.log(`Файл с аудио не найден: ${audioPath}`);
      }
    }
  }

  // to listen
  async getUserFromToken(token: string) {
    const decoded = this.jwtService.decode(token) as { id: number };
    const user = await this.prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateAlbumAndArtistListens(track, updateData: any) {

    if (track.album) {
      await this.prisma.album.update({
        where: { id: track.album.id },
        data: { listens: track.album.listens + 1 },
      });
    }
    
    if (track.artist) {
      await this.prisma.artist.update({
        where: { id: track.artist.id },
        data: { listens: track.artist.listens + 1 },
      });
    }

    await this.prisma.track.update({
      where: { id: track.id },
      data: updateData,
    });
  }

  // to likes
  async getUserFromTokenByAccessToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { tokens: { some: { accessToken: token } } },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getTrackWithLikes(trackId: number) {
    return await this.prisma.track.findUnique({
      where: { id: trackId },
      include: { likedByUsers: true, _count: true },
    });
  }
}