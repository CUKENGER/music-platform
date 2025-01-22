import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fsNot from 'fs';
import { ArtistService } from 'models/artist/artist.service';
import { AudioService } from 'models/audioService/audioService.service';
import { FileService, FileType } from 'models/file/file.service';
import * as path from 'path';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto, UpdateAlbumTracksDto } from './dto/update-album.dto';
import { IAlbum } from './types/Album';

@Injectable()
export class AlbumHelperService {
  constructor(
    private artistService: ArtistService,
    private audioService: AudioService,
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async findOrCreateArtist(
    dto: CreateAlbumDto,
    picture: Express.Multer.File | string,
    prisma,
  ): Promise<any> {
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
      artist = await this.artistService.create(artistDto, picture);
    }
    return artist;
  }

  async createAlbum(
    dto: CreateAlbumDto,
    imagePath: string,
    artistId: number,
    albumType: string,
    prisma,
  ): Promise<any> {
    return await prisma.album.create({
      data: {
        name: dto.name,
        genre: dto.genre,
        picture: imagePath,
        artistId: artistId,
        createdAt: new Date(),
        description: dto.description,
        releaseDate: dto.releaseDate,
        type: albumType,
      },
    });
  }

  async createTracks(
    dto: CreateAlbumDto,
    tracksPath: string[],
    artistId: number,
    albumId: number,
    imagePath: string,
    prisma,
  ): Promise<number> {
    let totalDuration = 0;

    for (let i = 0; i < dto.track_names.length; i++) {
      const duration = await this.audioService.getAudioDuration(
        path.resolve(__dirname, '../../../../', 'server/static', tracksPath[i]),
      );
      const durationInNum = await this.audioService.getAudioDurationInNum(
        path.resolve(__dirname, '../../../../', 'server/static', tracksPath[i]),
      );
      totalDuration += durationInNum;

      await prisma.track.create({
        data: {
          name: dto.track_names[i],
          artistId: artistId,
          text: dto.track_texts[i].trim() ? dto.track_texts[i] : 'Текст отсутствует',
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
    console.log('albumId', albumId);
    const formattedDuration = this.formatDuration(totalDuration);
    await prisma.album.update({
      where: { id: Number(albumId) },
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
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        tracks: true,
        comments: true,
        artist: true,
        likedByUsers: true,
      },
    });
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
        comments: true,
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
        const picturePath = path.resolve('static/', picture);

        if (fsNot.existsSync(picturePath)) {
          fsNot.unlinkSync(picturePath);
        } else {
          console.log(`Файл с изображением не найден: ${picturePath}`);
        }
      }
    } catch (e) {
      console.error(`Error deleteAlbumPicture: ${e}`);
      throw new InternalServerErrorException(`Error deleteAlbumPicture: ${e}`);
    }
  }

  private async deleteAlbumTracks(tracks) {
    try {
      if (tracks) {
        for (const track of tracks) {
          if (track.audio) {
            const audioPath = path.resolve('static/', track.audio);
            if (fsNot.existsSync(audioPath)) {
              fsNot.unlinkSync(audioPath);
            }
          }
          await this.prisma.track.delete({ where: { id: track.id } });
        }
      }
    } catch (e) {
      console.error(`Error deleteAlbumTracks: ${e}`);
      throw new InternalServerErrorException(`Error deleteAlbumTracks: ${e}`);
    }
  }

  private async deleteAlbumComments(comments) {
    try {
      if (comments) {
        for (const comment of comments) {
          await this.prisma.comment.delete({ where: { id: comment.id } });
        }
      }
    } catch (e) {
      console.error(`Error deleteAlbumComments: ${e}`);
      throw new InternalServerErrorException(`Error deleteAlbumComments: ${e}`);
    }
  }

  // to likes
  async findUserByToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        tokens: {
          some: {
            accessToken: token,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getAlbumWithLikes(albumId: number) {
    const album = await this.prisma.album.findUnique({
      where: { id: albumId },
      include: { likedByUsers: true, tracks: true },
    });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async updateAlbumLikes(albumId: number, userId: number, increment: number) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.album.update({
        where: { id: albumId },
        data: {
          likedByUsers:
            increment > 0 ? { connect: { id: userId } } : { disconnect: { id: userId } },
          likes: { increment },
        },
      });
    });
  }

  async updateAlbumTracksLikes(albumId: number, userId: number, increment: number) {
    try {
      const tracks = await this.prisma.track.findMany({
        where: { albumId },
        include: { likedByUsers: true },
      });

      await this.prisma.$transaction(async (prisma) => {
        for (const track of tracks) {
          if (track.likedByUsers.some((likedUser) => likedUser.id === userId)) {
            continue;
          }

          const currentLikes = track.likes;
          const newLikes = increment > 0 ? currentLikes + increment : Math.max(currentLikes - 1, 0);

          await prisma.track.update({
            where: { id: track.id },
            data: {
              likedByUsers: { connect: { id: userId } },
              likes: newLikes,
            },
          });
        }
      });
    } catch (error) {
      console.error('Error updating album tracks likes:', error);
      throw error;
    }
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

  validateLikeOperation(album: IAlbum, userId: number, isLike: boolean) {
    const isLiked = album.likedByUsers.some((likedUser) => likedUser.id === userId);
    if (isLike && isLiked) throw new BadRequestException('Album already liked by this user');
    if (!isLike && !isLiked) throw new BadRequestException('Album not liked by this user');
  }

  handleLikeError(error: Error, operation: string) {
    console.error(`Error ${operation}:`, error);
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    } else {
      throw new InternalServerErrorException(`Error ${operation} to album`);
    }
  }

  // to update

  async findOrCreateArtistForUpdateAlbum(
    dto: Partial<UpdateAlbumDto>,
    picture: Express.Multer.File | string,
    prisma,
  ): Promise<any> {
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
      artist = await this.artistService.create(artistDto, picture);
    }
    return artist;
  }

  async handleDeletedTracks(dto: Partial<UpdateAlbumDto>, album: IAlbum) {
    if (dto.deletedTracks && dto.deletedTracks.length > 0) {
      const tracksToDelete = album.tracks.filter((track) =>
        dto.deletedTracks.some((deletedTrack) => deletedTrack.id === track.id),
      );
      const tracksPathsToDelete = tracksToDelete.map((track) => track.audio);
      this.fileService.cleanupFiles(tracksPathsToDelete);

      await this.prisma.track.deleteMany({
        where: { id: { in: dto.deletedTracks.map((track) => Number(track.id)) } },
      });
    }
  }

  async handleNewTracks(
    id: number,
    newTracksFiles: Express.Multer.File[],
    tracksDto: UpdateAlbumTracksDto[],
    albumToUpdate: IAlbum,
    dto: Partial<UpdateAlbumDto>,
    picturePath: string,
    prisma,
  ) {
    if (!newTracksFiles?.length || !tracksDto) {
      return;
    }

    try {
      const tracksPath = await this.fileService.createTracks(newTracksFiles);
      let totalDuration = 0;
      const newTracksDto = tracksDto.filter((track) => track.isNew === 'true');

      console.log('newTracksDto', newTracksDto);

      for (let i = 0; i < newTracksDto.length; i++) {
        const duration = await this.audioService.getAudioDuration(tracksPath[i]);
        totalDuration += await this.audioService.getAudioDurationInNum(tracksPath[i]);

        await prisma.track.create({
          data: {
            name: newTracksDto[i].name,
            audio: tracksPath[i],
            picture: picturePath || albumToUpdate.picture,
            genre: dto.genre || albumToUpdate.genre,
            duration,
            text: newTracksDto[i].text || 'Текст отсутствует',
            artist: { connect: { id: albumToUpdate.artistId } },
            album: { connect: { id } },
          },
        });
      }

      await this.updateAlbumDuration(albumToUpdate.id, totalDuration, prisma);
      return tracksPath;
    } catch (e) {
      console.log('e', e);
      throw e;
    }
  }

  async handleTrackUpdates(
    tracksDto: UpdateAlbumTracksDto[],
    dto: Partial<UpdateAlbumDto>,
    albumToUpdate: IAlbum,
    prisma,
    tracksFiles: Express.Multer.File[],
  ) {
    if (!tracksDto?.length) return;

    try {
      const tracksToUpdate = tracksDto.filter((track) => track.id && track.isUpdated === 'true');

      for (const trackDto of tracksToUpdate) {
        let audioPath = null;
        const trackFile = tracksFiles.find(
          (file) => file.fieldname === `tracks[${trackDto.id}][audio]`,
        );

        if (trackFile) {
          audioPath = await this.fileService.createFile(FileType.AUDIO, trackFile);
          const oldTrack = await prisma.track.findUnique({
            where: { id: Number(trackDto.id) },
          });
          this.fileService.cleanupFile(oldTrack.audio);
        }
        await prisma.track.update({
          where: { id: Number(trackDto.id) },
          data: {
            name: trackDto.name,
            text: trackDto.text,
            genre: dto.genre || albumToUpdate.genre,
            ...(audioPath && {
              audio: audioPath,
              duration: await this.audioService.getAudioDuration(audioPath),
            }),
          },
        });
      }
    } catch (e) {
      console.error(`Error update tracks: ${e}`);
      throw e;
    }
  }
}
