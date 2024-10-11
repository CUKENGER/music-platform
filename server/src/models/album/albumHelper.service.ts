import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AlbumFileService, AlbumFileType } from "./albumFile/albumFile.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { ArtistService } from "models/artist/artist.service";
import { AudioService } from "models/audioService/audioService.service";
import { PrismaService } from "prisma/prisma.service";
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class AlbumHelperService {
  constructor(
    private albumFileService: AlbumFileService,
    private artistService: ArtistService,
    private audioService: AudioService,
    private prisma: PrismaService
  ) { }

  // to create
  saveTracks(files): string[] {
    return this.albumFileService.createTracks(files.tracks);
  }

  saveImage(files): string {
    return this.albumFileService.createCover(AlbumFileType.IMAGE, files.picture);
  }

  async findOrCreateArtist(dto: CreateAlbumDto, files, prisma): Promise<any> {
    let artist = await prisma.artist.findFirst({
      where: { name: dto.artist },
      include: { tracks: true, albums: true },
    });

    if (!artist) {
      const artistDto = {
        name: dto.artist,
        genre: dto.genre,
        description: '',
      };
      artist = await this.artistService.create(artistDto, files.picture);
    }

    return artist;
  }

  async createAlbum(dto: CreateAlbumDto, imagePath: string, artistId: number, prisma): Promise<any> {
    return await prisma.album.create({
      data: {
        name: dto.name,
        genre: dto.genre,
        picture: imagePath,
        artistId: artistId,
        createdAt: new Date(),
        description: dto.description,
        releaseDate: dto.releaseDate,
      },
    });
  }

  async createTracks(dto: CreateAlbumDto, tracksPath: string[], artistId: number, albumId: number, imagePath: string, prisma): Promise<number> {
    let totalDuration = 0;

    for (let i = 0; i < dto.track_names.length; i++) {
      const duration = await this.audioService.getAudioDuration(tracksPath[i]);
      const durationInNum = await this.audioService.getAudioDurationInNum(tracksPath[i]);
      totalDuration += durationInNum;

      await prisma.track.create({
        data: {
          name: dto.track_names[i],
          artistId: artistId,
          text: dto.track_texts[i],
          audio: tracksPath[i],
          picture: imagePath,
          genre: dto.genre,
          duration: duration,
          albumId: albumId,
        },
      });
    }

    return totalDuration;
  }

  async updateAlbumDuration(albumId: number, totalDuration: number, prisma): Promise<void> {
    const formattedDuration = this.formatDuration(totalDuration);
    await prisma.album.update({
      where: { id: albumId },
      data: { duration: formattedDuration },
    });
  }

  private formatDuration(totalDuration: number): string {
    const totalMinutes = Math.floor(totalDuration / 60);
    const totalSeconds = Math.round(totalDuration % 60);
    return `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
  }

  // to listen
  async getAlbumById(id: number) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
    return album;
  }

  async incrementAlbumListens(album) {
    const updatedAlbum = await this.prisma.album.update({
      where: { id: album.id },
      data: { listens: album.listens + 1 },
    });
    return updatedAlbum.id;
  }

  // to delete
  async getAlbumWithRelations(id: number) {
    return await this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: true,
        tracks: true,
        comments: true
      },
    });
  }

  async deleteAlbumResources(album) {
    try {
      await this.deleteAlbumPicture(album.picture);
      await this.deleteAlbumTracks(album.tracks);
      await this.deleteAlbumComments(album.comments);
      await this.prisma.album.delete({ where: { id: album.id } });
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting resources for album ${album.id}`);
    }
  }

  async deleteAlbumPicture(picture: string) {
    try {
      if (picture) {
        const picturePath = path.resolve(__dirname, '../../../../', 'server/static', picture);
        await fs.unlink(picturePath);
      }
    } catch(e){
      console.error(`Error deleteAlbumPicture: ${e}`);
      throw new InternalServerErrorException(`Error deleteAlbumPicture: ${e}`)
    }
    
  }

  private async deleteAlbumTracks(tracks) {
    try {
      if(tracks) {
        for (const track of tracks) {
          if (track.audio) {
            const audioPath = path.resolve(__dirname, '../../../../', 'server/static', track.audio);
            await fs.unlink(audioPath);
          }
          await this.prisma.track.delete({ where: { id: track.id } });
        }
      }
    } catch(e) {
      console.error(`Error deleteAlbumTracks: ${e}`);
      throw new InternalServerErrorException(`Error deleteAlbumTracks: ${e}`)
    }
  }

  private async deleteAlbumComments(comments) {
    try {
      if(comments) {
        for (const comment of comments) {
          await this.prisma.comment.delete({ where: { id: comment.id } });
        }
      }
    } catch(e) {
      console.error(`Error deleteAlbumComments: ${e}`);
      throw new InternalServerErrorException(`Error deleteAlbumComments: ${e}`)
    }
  }

  // to likes
  async findUserByToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { tokens: { some: { accessToken: token } } },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getAlbumWithLikes(albumId: number) {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
      include: { likedByUsers: true },
    });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async updateAlbumLikes(albumId: number, userId: number, increment: number) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.album.update({
        where: { id: albumId },
        data: {
          likedByUsers: increment > 0
            ? { connect: { id: userId } }
            : { disconnect: { id: userId } },
          likes: { increment },
        },
      });
    });
  }

  async getAlbumWithLikeCount(albumId: number) {
    return await this.prisma.album.findUnique({
      where: { id: albumId },
      include: {
        likedByUsers: true,
        _count: true,
      },
    });
  }

  validateLikeOperation(album, userId: number, isLike: boolean) {
    const isLiked = album.likedByUsers.some((likedUser) => likedUser.id === userId);
    if (isLike && isLiked) throw new BadRequestException('Album already liked by this user');
    if (!isLike && !isLiked) throw new BadRequestException('Album not liked by this user');
  }

  handleLikeError(error: any, operation: string) {
    console.error(`Error ${operation}:`, error);
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    } else {
      throw new InternalServerErrorException(`Error ${operation} to album`);
    }
  }
}