import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { CreateAlbumCommentDto } from "./dto/create-albumComment.dto";
import { AlbumFileService, AlbumFileType } from "./albumFile/albumFile.service";
import * as path from 'path'
import * as fs from 'fs/promises';
import { PrismaService } from "prisma/prisma.service";
import { ArtistService } from "models/artist/artist.service";
import { AudioService } from "models/audioService/audioService.service";
import { CommentService } from "models/comment/comment.service";

@Injectable()
export class AlbumService {
    
    constructor(
        private prisma: PrismaService,
        private albumFileService: AlbumFileService,
        private artistService: ArtistService,
        private audioService: AudioService,
        private commentService: CommentService
    ) {
    }

    async create(dto: CreateAlbumDto, files): Promise<string> {
        if (!files) {
          console.log('Файлы не загружены');
          throw new HttpException('Files not found', HttpStatus.NOT_FOUND);
        }
      
        const tracksPath = this.albumFileService.createTracks(AlbumFileType.AUDIO, files.tracks);
        const imagePath = this.albumFileService.createCover(AlbumFileType.IMAGE, files.picture);
      
        let artist = await this.prisma.artist.findFirst({
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
      
        // Создание нового альбома
        const newAlbum = await this.prisma.album.create({
          data: {
            name: dto.name,
            genre: dto.genre,
            picture: imagePath,
            artistId: artist.id, // Используем artistId вместо связи через connect
            createdAt: new Date(),
          },
        });
      
        // Создание треков
        for (let i = 0; i < dto.track_names.length; i++) {
            const duration = await this.audioService.getAudioDuration(tracksPath[i]);
            
            await this.prisma.track.create({
            data: {
                name: dto.track_names[i],
                artistId: artist.id,
                text: dto.track_texts[i],
                audio: tracksPath[i],
                picture: imagePath,
                genre: dto.genre,
                duration: duration,
                albumId: newAlbum.id,
                artist: dto.artist,
            },
            });
        }
      
        return JSON.stringify({ id: newAlbum.id, name: newAlbum.name });
    }
      
    async getAll(){
        const albums = await this.prisma.album.findMany({
            include: {tracks: true, artist: true}
        })
        return albums
    }

    async listen(id: string): Promise<string> {
        try {
            // Поиск альбома по уникальному идентификатору
            const album = await this.prisma.album.findUnique({
                where: { id: id }
            });
    
            if (album) {
                // Увеличение числа прослушиваний на 1
                const updatedAlbum = await this.prisma.album.update({
                    where: { id: id },
                    data: { listens: album.listens + 1 },
                });
    
                return updatedAlbum.id;
            } else {
                throw new Error(`Album with id ${id} not found`);
            }
        } catch (e) {
            console.log('Error in Listen Service:', e);
            throw new Error(`Error in add listen album ${e}`);
        }
    }

    async getOne(id: string) {
        const album = await this.prisma.album.findFirst({where : {id: id}, include: {tracks: true, artist: true}})
        return album
    } 

    async addComment(dto: CreateAlbumCommentDto) {
        const album = await this.prisma.album.findFirst({where: {id: dto.albumId}, include: {artist: true, tracks: true}})
        if (!album) {
            throw new Error(`Album with ${dto.albumId} id not found `)
        }

        const comment = await this.commentService.addCommentOrReply(dto)

        return comment;
    }

    async delete(id: string) {
        const album = await this.prisma.album.findUnique({
          where: { id },
          include: {
            artist: true,
            tracks: true,
            comments: true
          },
        });
    
        if (!album) {
          throw new NotFoundException(`Album with id ${id} not found`);
        }
    
        try {
          // Удаление изображения альбома
          if (album.picture) {
            const picturePath = path.resolve('static/', album.picture);
            await fs.unlink(picturePath);
          } else {
            console.warn('Album picture not found');
          }
          
          // Удаление аудиофайлов треков и треков из базы данных
          if (album.tracks.length > 0) {
            await Promise.all(album.tracks.map(async (track) => {
              if (track.audio) {
                const audioPath = path.resolve('static/', track.audio);
                await fs.unlink(audioPath);
              }
              await this.prisma.track.delete({ where: { id: track.id } });
            }));
          }
    
          // Удаление комментариев альбома
          if (album.comments.length > 0) {
            await Promise.all(album.comments.map(async (comment) => {
              await this.prisma.comment.delete({ where: { id: comment.id } });
            }));
          }
    
          // Удаление альбома из базы данных
          await this.prisma.album.delete({ where: { id } });
    
        } catch (error) {
          console.error(`Error deleting resources for album ${id}:`, error);
          throw new InternalServerErrorException(`Error deleting resources for album ${id}`);
        }
    
        return album; // Возвращаем удаленный альбом
      }

      async searchByName(query: string, count: number, offset: number) {
        const albums = await this.prisma.album.findMany({
          where: {
            name: {
              contains: query, // Используем оператор contains для поиска по подстроке
              mode: 'insensitive', // Регистронезависимый поиск
            },
          },
          include: {
            tracks: true, // Включаем связанные треки
            comments: true, // Включаем связанные комментарии
          },
          skip: offset, // Пропускаем определенное количество записей для пагинации
          take: count, // Ограничиваем количество возвращаемых записей
        });
      
        return albums;
      }

    async addLike(id) {
        try {
            const album = await this.prisma.album.findFirst({where: {id: id}})
            if(album) {
                await this.prisma.album.update({
                    where: {id},
                    data: {likes: album.likes + 1}
                })
            } else{
                throw new Error(`Album with ${id} id not found`)
            }
        } catch(e) {
            console.log('in AddLike Servicce', e)
            throw new InternalServerErrorException('Error addLike to album')
        }
    }

    async deleteLike(id) {
        try {
            const album = await this.prisma.album.findFirst({where: {id: id}})
            if(album) {
                await this.prisma.album.update({
                    where: {id},
                    data: {likes: album.likes - 1}
                })
            } else{
                throw new Error(`Album with ${id} id not found`)
            }
        } catch(e) {
            console.log('in AddLike Servicce', e)
            throw new InternalServerErrorException('Error addLike to album')
        }
    }


}