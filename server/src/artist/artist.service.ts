import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Artist } from "./scheme/artist.schema";
import { Repository } from "typeorm";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { CreateArtistCommentDto } from "./dto/create-artistComment.dto";
import { ArtistComment } from "./artistComment/artistComment.schema";
import * as path from 'path';
import * as fs from 'fs/promises'
import { ArtistFileService, ArtistFileType } from "./artistFile/artistFile.service";
import { Track } from "src/track/scheme/track.schema";

@Injectable()
export class ArtistService {

    constructor(
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,
        @InjectRepository(ArtistComment)
        private commentRepository: Repository<ArtistComment>,
        private artistFileService: ArtistFileService,
        @InjectRepository(Track)
        private trackRepository: Repository<Track>
    ) {

    }

    async create(dto: CreateArtistDto, picture): Promise<Artist> {

        const imagePath = this.artistFileService.createCover(ArtistFileType.IMAGE, picture)

        const newArtist = await this.artistRepository.create(dto)
        newArtist.listens = 0
        newArtist.likes = 0
        newArtist.picture = imagePath
        return await this.artistRepository.save(newArtist);
    }

    async getAll(count=50, offset=0): Promise<Artist[]>{
        const artists = await this.artistRepository.find({
            skip: offset,
            take: count,
            relations: ['tracks', 'comments', 'albums']
        })
        console.log('getAll work');
        return artists
    }

    async listen(id) {
        try {
            const artist = await this.artistRepository.findOne({where: {id: id}})
            if(artist) {
                artist.listens +=1
                await this.artistRepository.save(artist)
                return artist.id
            } else{
                throw new Error(`Artist with ${id} id not found`)
            }
        } catch(e) {
            console.log('in Listen Servicce', e)
            throw e
        }
    }

    async addLike(id) {
        try {
            const artist = await this.artistRepository.findOne({where: {id: id}})
            if(artist) {
                artist.likes +=1
                await this.artistRepository.save(artist)
                return artist.id
            } else{
                throw new Error(`Artist with ${id} id not found`)
            }
        } catch(e) {
            console.log('in AddLike Servicce', e)
            throw e
        }
    }

    async deleteLike(id) {
        try {
            const artist = await this.artistRepository.findOne({where: {id: id}})
            if(artist) {
                artist.likes -=1
                await this.artistRepository.save(artist)
                return artist.id
            } else{
                throw new Error(`Artist with ${id} id not found`)
            }
        } catch(e) {
            console.log('in DeleteLike Servicce', e)
            throw e
        }
    }

    async getOne(id: number): Promise<Artist> {
        const artist = await this.artistRepository.findOne({where : {id} })
        return artist
    } 

    async addComment(dto: CreateArtistCommentDto): Promise<ArtistComment> {
        const comment = await this.commentRepository.create({...dto})
        await this.commentRepository.save(comment)
        const artist = await this.artistRepository.findOne({where: {id: dto.artistId}, relations: ['tracks', 'comments', 'albums']})
        if (!artist) {
            throw new Error(`Artist with ${dto.artistId} id not found `)
        }
        comment.artist = artist;
        await this.commentRepository.save(comment);
        artist.comments.push(comment);
        await this.artistRepository.save(artist);
        return comment;
    }

    async delete(id: number):Promise<Artist> {
        const artist = await this.artistRepository.findOne({ where: { id } });
        if (!artist) {
            throw new Error(`Artist with ${id} id not found`);
        }
        
        if (artist.picture) {
            try {
                console.log('artist.picture', artist.picture);
                const picturePath = path.resolve('static/', artist.picture);
                await fs.unlink(picturePath);
            } catch (error) {
                console.error(`Error deleting picture for artist ${id}:`, error);
            }
        } else{
            console.log('artist.picture not found')
        }
        await this.commentRepository.delete({ artistId: id });
        await this.trackRepository.delete({ artistId: id })
        await this.artistRepository.delete(id);
        return artist;
    }

    async searchByName(query: string, count: number, offset: number):Promise<Artist[]> {
		const artists = await this.artistRepository
        .createQueryBuilder('artist')
        // .leftJoinAndSelect('artist.tracks', 'tracks')
        // .leftJoinAndSelect('artist.comments', 'comments')
        // .leftJoinAndSelect('artist.albums', 'albums')
        .where('LOWER(artist.name) LIKE LOWER(:name)', { name: `%${query}%` })
		.skip(offset)
		.take(count)
        .getMany();

    	return artists;
	}


}