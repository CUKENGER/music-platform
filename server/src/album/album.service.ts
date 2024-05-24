import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Album } from "./album.schema";
import {Repository } from "typeorm";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { CreateAlbumCommentDto } from "./dto/create-albumComment.dto";
import { AlbumComment } from "./commentAlbum/albumComment.schema";
import { AlbumFileService, AlbumFileType } from "./albumFile/albumFile.service";
import { Track } from "src/track/scheme/track.schema";
import * as path from 'path'
import * as fs from 'fs/promises';
import { Artist } from "src/artist/scheme/artist.schema";
import { ArtistService } from "src/artist/artist.service";

@Injectable()
export class AlbumService {
    
    constructor(
        @InjectRepository(Album)
        private albumRepository: Repository<Album>,
        @InjectRepository(AlbumComment)
        private commentRepository: Repository<AlbumComment>,
        private albumFileService: AlbumFileService,
        @InjectRepository(Track)
        private trackRepository: Repository<Track>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,
        private artistService: ArtistService
    ) {
    }

    async create(dto: CreateAlbumDto, files): Promise<string> {
        if (!files) {
            console.log('Файлы не загружены');
            return 'ничего не загружено';
        }
    
        const tracksPath = this.albumFileService.createTracks(AlbumFileType.AUDIO, files.tracks);
        const imagePath = this.albumFileService.createCover(AlbumFileType.IMAGE, files.picture);
    
        // Проверка на существование артиста
        let artist = await this.artistRepository.findOne({ where: { name: dto.artist } });
    
        if (!artist) {
            const artistDto = {
                name: dto.artist,
                genre: dto.genre,
                description: '',
            };
            artist = await this.artistService.create(artistDto, files.picture);
        }
    
        // Создание нового альбома
        const newAlbum = this.albumRepository.create({
            ...dto,
            listens: 0,
            likes: 0,
            genre: dto.genre,
            picture: imagePath,
            tracks: files.tracks,
            artistEntity: artist,
        });
    
        await this.albumRepository.save(newAlbum);
    
        // Создание и сохранение треков
        const trackDtos = files.tracks.map((track, index) => ({
            name: dto.track_names[index],
            artist: dto.artist,
            text: dto.track_texts[index],
            audio: tracksPath[index],
            album: newAlbum,
            picture: imagePath,
            genre: dto.genre,
        }));
    
        await this.trackRepository.save(trackDtos);
    
        return JSON.stringify({ id: newAlbum.id, name: newAlbum.name });
    }
    
    async getAll(count=50, offset=0): Promise<Album[]>{
        const albums = await this.albumRepository.find({
            skip: offset,
            take: count,
            relations: ['tracks', 'comments', 'artistEntity']
        })
        return albums
    }

    async listen(id) {
        try {
            const album = await this.albumRepository.findOne({where: {id: id}})
            if(album) {
                album.listens +=1
                await this.albumRepository.save(album)
                return album.id
            } else{
                throw new Error(`Album with ${id} id not found`)
            }
        } catch(e) {
            console.log('in Listen Servicce', e)
            throw e
        }
    }

    async getOne(id: number): Promise<Album> {
        const album = await this.albumRepository.findOne({where : {id}, relations: ['comments', 'tracks'] })
        return album
    } 

    async addComment(dto: CreateAlbumCommentDto): Promise<AlbumComment> {
        const comment = await this.commentRepository.create({...dto})
        await this.commentRepository.save(comment)
        const album = await this.albumRepository.findOne({where: {id: dto.albumId}, relations: ['comments']})
        if (!album) {
            throw new Error(`Album with ${dto.albumId} id not found `)
        }
        comment.album = album;
        await this.commentRepository.save(comment);
        album.comments.push(comment);
        await this.albumRepository.save(album);
        return comment;
    }

    async delete(id: number):Promise<Album> {
        const album = await this.albumRepository.findOne({ where: { id } , relations: ['tracks', 'comments'] });
        if (!album) {
            throw new Error(`Album with ${id} id not found`);
        }
        // Удаление изображения, если оно существует
        if (album.picture) {
            try {
                console.log('album.picture', album.picture);
                const picturePath = path.resolve('static/', album.picture);
                await fs.unlink(picturePath);
            } catch (error) {
                console.error(`Error deleting picture for album ${id}:`, error);
            }
        } else{
            console.log('album.picture not found')
        }
        // Удаление аудиофайлов, если они существуют
        if (Array.isArray(album.tracks) && album.tracks.length > 0) {
            try {
                await Promise.all(album.tracks.map(async (track) => {
                    if (track.audio) {
                        console.log('track.audio', track.audio);
                        await this.trackRepository.delete(track.id)
                        // const audioPath = path.resolve('static/', track.audio);
                        // await fs.unlink(audioPath);
                    }
                }));
            } catch (error) {
                console.error(`Error deleting audio files for album ${id}:`, error);
            }
        } else{
            console.log(`album.tracks not found`)
        }
        await this.trackRepository.delete({ albumId: id });
        // Удаление связанных комментариев
        await this.commentRepository.delete({ albumId: id });
        // Удаление альбома из базы данных
        await this.albumRepository.delete(id);
        return album; // Возвращаем удаленный альбом
    }

    async searchByName(query: string, count: number, offset: number): Promise<Album[]> {
		const albums = await this.albumRepository
        .createQueryBuilder('album')
        .leftJoinAndSelect('album.tracks', 'tracks')
        .leftJoinAndSelect('album.comments', 'comments')
        .where('LOWER(album.name) LIKE LOWER(:name)', { name: `%${query}%` })
		.skip(offset)
		.take(count)
        .getMany();

    	return albums;
	}

}