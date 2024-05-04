import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Album } from "./album.schema";
import { DeepPartial, Repository } from "typeorm";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { CreateAlbumCommentDto } from "./dto/create-albumComment.dto";
import { AlbumComment } from "./commentAlbum/albumComment.schema";
import { AlbumFileService, AlbumFileType } from "./albumFile/albumFile.service";
import * as uuid from 'uuid'
import { Track } from "src/track/scheme/track.schema";
import { FileService } from "src/file/file.service";

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
    ) {
    }

    async create(dto: CreateAlbumDto, picture, tracks): Promise<string> {
        if (picture && tracks) {
			const tracksPath = this.albumFileService.createTracks(AlbumFileType.AUDIO, tracks)
			const imagePath = this.albumFileService.createCover(AlbumFileType.IMAGE, picture)
			console.log('audioPath',tracksPath)
			console.log('imagePath',imagePath)
            const newAlbum = await this.albumRepository.create(dto)
            newAlbum.listens = 0
            newAlbum.picture = imagePath
            newAlbum.tracks = tracks
            await this.albumRepository.save(newAlbum)
            const trackDtos = tracks.map((track, index) => ({
                name: track.originalname.split('.')[1].trim(),
                artist: dto.artist,
                text: '',
                audio: tracksPath[index],
                album: newAlbum,
                listens: 0,
                picture: imagePath
            }));
			await this.trackRepository.save(trackDtos);
			return newAlbum.id + ' ' + newAlbum.name;
		} else {
			console.log('нихуя не загрузилось блять')
		}
    }
    

    async getAll(count=10, offset=0): Promise<Album[]>{
        const albums = await this.albumRepository.find({
            skip: offset,
            take: count
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
        const album = await this.albumRepository.findOne({where: {id}})
        if (!album) {
            throw new Error(`Album with ${id} id not found`)
        }
        const deleteAlbum = await this.albumRepository.delete(id)
        return album
    }

    async search(query):Promise<Album[]> {
        const albums = await this.albumRepository
            .createQueryBuilder("album")
            .where("album.name LIKE :name", {name: `%${query}%`})
            .getMany()
        return albums
    }

}