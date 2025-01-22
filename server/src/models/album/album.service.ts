import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Album, AlbumType, Artist } from '@prisma/client';
import { AudioService } from 'models/audioService/audioService.service';
import { CommentService } from 'models/comment/comment.service';
import { FileService, FileType } from 'models/file/file.service';
import { UserService } from 'models/user/user.service';
import { PrismaService } from 'prisma/prisma.service';
import { AlbumHelperService } from './albumHelper.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateAlbumCommentDto } from './dto/create-albumComment.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ArtistService } from 'models/artist/artist.service';

@Injectable()
export class AlbumService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private commentService: CommentService,
    private albumHelperService: AlbumHelperService,
    private userService: UserService,
    private artistService: ArtistService,
  ) {}

  async create(dto: CreateAlbumDto, files): Promise<string> {
    if (!files) {
      throw new NotFoundException('Files not found');
    }

    let tracksPath: string[] = [];
    let imagePath: string;

    const transaction = this.prisma.$transaction(
      async (prisma) => {
        try {
          tracksPath = await this.fileService.createTracks(files.tracks);
          imagePath = await this.fileService.createFile(FileType.IMAGE, files.picture);

          let AlbumType: AlbumType;
          if (dto.type.trim() !== '') {
            AlbumType = dto.track_names.length > 1 ? 'ALBUM' : 'SINGLE';
          } else {
            AlbumType = 'COLLECTION';
          }

          const artist = await this.albumHelperService.findOrCreateArtist(dto, files, prisma);
          const newAlbum = await this.albumHelperService.createAlbum(
            dto,
            imagePath,
            artist.id,
            AlbumType,
            prisma,
          );
          const totalDuration = await this.albumHelperService.createTracks(
            dto,
            tracksPath,
            artist.id,
            newAlbum.id,
            imagePath,
            prisma,
          );

          await this.albumHelperService.updateAlbumDuration(newAlbum.id, totalDuration, prisma);

          if (dto.featArtists && dto.featArtists.length > 0) {
            for (const featArtistName of dto.featArtists) {
              let artist = await this.prisma.artist.findFirst({
                where: { name: featArtistName },
                include: { tracks: true, albums: true },
              });

              if (!artist) {
                const artistDto = {
                  name: featArtistName,
                  genre: dto.genre,
                  description: '',
                };
                artist = await this.artistService.create(artistDto, files.picture);
              }
              await this.prisma.featuredArtist.create({
                data: {
                  artistId: artist.id,
                  albumId: newAlbum.id,
                },
              });
            }
          }

          return { id: newAlbum.id, name: newAlbum.name };
        } catch (e) {
          this.fileService.cleanupFiles(tracksPath, imagePath);
          console.log(`Error creating album: ${e.message}`);
          throw new InternalServerErrorException(`Error creating album: ${e.message}`);
        }
      },
      { timeout: 60000 },
    );

    return transaction
      .then((result) => JSON.stringify(result))
      .catch((e) => {
        throw new InternalServerErrorException(`Transaction failed: ${e.message}`);
      });
  }

  async getAll(page: number, count: number, sortBy: string) {
    const limit = count;
    const offset = page * limit;
    let orderBy: any = {};

    switch (sortBy) {
      case 'Все':
        orderBy = { id: 'asc' };
        break;
      case 'По алфавиту':
        orderBy = { name: 'asc' };
        break;
      case 'Популярные':
        orderBy = { listens: 'desc' };
        break;
      default:
        orderBy = { id: 'asc' };
    }

    try {
      return await this.prisma.album.findMany({
        skip: offset,
        take: Number(limit),
        orderBy: orderBy,
        include: {
          artist: true,
          tracks: true,
          comments: true,
          likedByUsers: true,
        },
      });
    } catch (e) {
      console.error(`Error get All albums:`, e);
    }
  }

  async listen(id: number): Promise<number> {
    const album = await this.albumHelperService.getAlbumById(id);

    return await this.albumHelperService.incrementAlbumListens(album);
  }

  async getOne(id: number) {
    const album = await this.prisma.album.findFirst({
      where: { id: id },
      include: {
        tracks: {
          include: {
            artist: true,
            comments: true,
          },
          orderBy: {
            id: 'asc',
          },
        },
        artist: true,
        comments: true,
        likedByUsers: true,
      },
    });
    return album;
  }

  async addComment(dto: CreateAlbumCommentDto) {
    const album = await this.prisma.album.findFirst({
      where: { id: dto.albumId },
      include: { artist: true, tracks: true },
    });
    if (!album) {
      throw new NotFoundException(`Album with ${dto.albumId} id not found `);
    }

    const comment = await this.commentService.addCommentOrReply(dto);

    return comment;
  }

  async delete(id: number) {
    try {
      const album = await this.albumHelperService.getAlbumWithRelations(id);
      if (!album) {
        throw new NotFoundException(`Album with ${id} not found`);
      }

      await this.albumHelperService.deleteAlbumResources(album);

      return album;
    } catch (e) {
      console.error(`Error delete album: ${e}`);
      throw new InternalServerErrorException(`Error delete album: ${e}`);
    }
  }

  async searchByName(query: string, count: number, offset: number) {
    const albums = await this.prisma.album.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        tracks: true,
        comments: true,
      },
      skip: offset,
      take: count,
    });

    return albums;
  }

  async addLike(albumId: number, token: string) {
    try {
      const user = await this.userService.getByToken(token);
      const album = await this.albumHelperService.getAlbumWithLikes(albumId);

      this.albumHelperService.validateLikeOperation(album, user.id, true);

      await this.albumHelperService.updateAlbumTracksLikes(albumId, user.id, 1);

      await this.albumHelperService.updateAlbumLikes(albumId, user.id, 1);

      return await this.albumHelperService.getAlbumWithLikeCount(albumId);
    } catch (e) {
      this.albumHelperService.handleLikeError(e, 'adding like');
    }
  }

  async deleteLike(albumId: number, token: string) {
    try {
      const user = await this.albumHelperService.findUserByToken(token);
      const album = await this.albumHelperService.getAlbumWithLikes(albumId);

      this.albumHelperService.validateLikeOperation(album, user.id, false);

      await this.albumHelperService.updateAlbumTracksLikes(albumId, user.id, -1);

      await this.albumHelperService.updateAlbumLikes(albumId, user.id, -1);

      return await this.albumHelperService.getAlbumWithLikeCount(albumId);
    } catch (e) {
      this.albumHelperService.handleLikeError(e, 'removing like');
    }
  }

  async getComments(id: number) {
    return this.commentService.getCommentsByEntity('album', id);
  }

  async getLimitPopular() {
    try {
      return await this.prisma.album.findMany({
        take: 20,
        orderBy: {
          listens: 'asc',
        },
        include: {
          artist: true,
          tracks: true,
          comments: true,
          likedByUsers: true,
        },
      });
    } catch (e) {
      console.error(`Error get limit popular albums:`, e);
    }
  }

  async getAllPopular() {
    try {
      return await this.prisma.album.findMany({
        orderBy: { listens: 'desc' },
        include: {
          artist: true,
          tracks: true,
          comments: true,
          likedByUsers: true,
        },
      });
    } catch (e) {
      console.error('Error get all popular albums:', e);
    }
  }

  async update(id: number, dto: Partial<UpdateAlbumDto>, pictureFile, tracksFiles, newTracksFiles) {
    let tracksPath: string[] = [];
    let picturePath: string;

    try {
      const albumToUpdate = await this.albumHelperService.getAlbumById(id);
      if (pictureFile) {
        picturePath = await this.fileService.createFile(FileType.IMAGE, pictureFile);
        this.fileService.cleanupFile(albumToUpdate.picture);
      }

      const artist = await this.albumHelperService.findOrCreateArtistForUpdateAlbum(
        dto,
        pictureFile || albumToUpdate.picture,
        this.prisma,
      );

      return await this.prisma.$transaction(
        async (prisma) => {
          const updatedAlbum = await prisma.album.update({
            where: { id },
            data: {
              name: dto.name || albumToUpdate.name,
              picture: picturePath || albumToUpdate.picture,
              genre: dto.genre || albumToUpdate.genre,
              description: dto.description || albumToUpdate.description,
              releaseDate: dto.releaseDate || albumToUpdate.releaseDate,
              artist: {
                connect: { id: artist.id },
              },
            },
          });

          await this.albumHelperService.handleDeletedTracks(dto, albumToUpdate);

          for (const trackDto of dto.tracks) {
            const { isNew, isUpdated } = trackDto;
            const isNewBool = isNew === 'true';
            const isUpdatedBool = isUpdated === 'true';

            if (isNewBool) {
              console.log('isNewBool');
              tracksPath =
                (await this.albumHelperService.handleNewTracks(
                  id,
                  newTracksFiles,
                  dto.tracks,
                  albumToUpdate,
                  dto,
                  picturePath,
                  prisma,
                )) || [];
            } else if (isUpdatedBool) {
              console.log('isUpdatedBool');
              await this.albumHelperService.handleTrackUpdates(
                dto.tracks,
                dto,
                albumToUpdate,
                prisma,
                tracksFiles,
              );
            }
          }

          return updatedAlbum;
        },
        { timeout: 60000 },
      );
    } catch (e) {
      this.fileService.cleanupFiles(tracksPath, picturePath);
      console.error(`Error update album: ${e}`);
      throw new InternalServerErrorException(`Error update album: ${e}`);
    }
  }
}
