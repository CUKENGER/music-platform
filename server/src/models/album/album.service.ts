import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { CreateAlbumCommentDto } from "./dto/create-albumComment.dto";
import { PrismaService } from "prisma/prisma.service";
import { CommentService } from "models/comment/comment.service";
import { AlbumHelperService } from "./albumHelper.service";
import { UserService } from "models/user/user.service";
import { FileService, FileType } from "models/file/file.service";

@Injectable()
export class AlbumService {

  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private commentService: CommentService,
    private albumHelperService: AlbumHelperService,
    private userService: UserService
  ) {
  }

  async create(dto: CreateAlbumDto, files): Promise<string> {
    if (!files) {
      throw new NotFoundException('Files not found');
    }

    let tracksPath: string[] = [];
    let imagePath: string;

    const transaction = this.prisma.$transaction(async (prisma) => {
      try {
        tracksPath = await this.fileService.createTracks(files.tracks);
        imagePath = await this.fileService.createFile(FileType.IMAGE, files.picture);

        let AlbumType = dto.track_names.length > 1 ? 'ALBUM' : "SINGLE"

        console.log('imagePath album', imagePath)
        console.log('tracksPath album', tracksPath)

        const artist = await this.albumHelperService.findOrCreateArtist(dto, files, prisma);
        const newAlbum = await this.albumHelperService.createAlbum(dto, imagePath, artist.id, AlbumType, prisma);
        const totalDuration = await this.albumHelperService.createTracks(dto, tracksPath, artist.id, newAlbum.id, imagePath, prisma);

        await this.albumHelperService.updateAlbumDuration(newAlbum.id, totalDuration, prisma);

        return { id: newAlbum.id, name: newAlbum.name };

      } catch (e) {
        this.fileService.cleanupFiles(tracksPath, imagePath);
        console.log(`Error creating album: ${e.message}`)
        throw new InternalServerErrorException(`Error creating album: ${e.message}`);
      }
    }, { timeout: 60000});

    return transaction
      .then(result => JSON.stringify(result))
      .catch(e => {
        throw new InternalServerErrorException(`Transaction failed: ${e.message}`);
      });
  }

  async getAll(offset?: number, count?: number) {
    const limit = count ? Number(count) : 20;
    const skip = offset ? Number(offset) : 0;

    const albums = await this.prisma.album.findMany({
      take: limit,
      skip: skip,
      include: {
        comments: true,
        likedByUsers: true,
        artist: true,
        tracks: true
      },
      where: {
        type: "ALBUM"
      }
    });
    return albums
  }

  async listen(id: number): Promise<number> {
    const album = await this.albumHelperService.getAlbumById(id);

    return await this.albumHelperService.incrementAlbumListens(album);
  }

  async getOne(id: number) {
    const album = await this.prisma.album.findFirst({
      where: { id: id }, include: {
        tracks: {
          include: {
            artist: true,
          }
        },
        artist: true,
        comments: true,
        likedByUsers: true,
      }
    })
    return album
  }

  async addComment(dto: CreateAlbumCommentDto) {
    const album = await this.prisma.album.findFirst({ where: { id: dto.albumId }, include: { artist: true, tracks: true } })
    if (!album) {
      throw new NotFoundException(`Album with ${dto.albumId} id not found `)
    }

    const comment = await this.commentService.addCommentOrReply(dto)

    return comment;
  }

  async delete(id: number) {
    try {
      const album = await this.albumHelperService.getAlbumWithRelations(id);
      if(!album) {
        throw new NotFoundException(`Album with ${id} not found`)
      }

      await this.albumHelperService.deleteAlbumResources(album);
  
      return album;
    } catch(e) {
      console.error(`Error delete album: ${e}`)
      throw new InternalServerErrorException(`Error delete album: ${e}`)
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
      const user = await this.userService.getByToken(token)
      const album = await this.albumHelperService.getAlbumWithLikes(albumId);

      this.albumHelperService.validateLikeOperation(album, user.id, true);

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

      await this.albumHelperService.updateAlbumLikes(albumId, user.id, -1);

      return await this.albumHelperService.getAlbumWithLikeCount(albumId);
    } catch (e) {
      this.albumHelperService.handleLikeError(e, 'removing like');
    }
  }

  async getComments(id: number) {
    return this.commentService.getCommentsByEntity("album", id)
  }

}