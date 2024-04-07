import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './scheme/track.schema';
import { Comment } from './scheme/comment.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class TrackService {

	constructor(
		@InjectRepository(Track) 
		private trackRepository: Repository<Track>,
		@InjectRepository(Comment) 
		private commentRepository: Repository<Comment>,
		private fileService: FileService) {

	}

	async create(createTrackDto: CreateTrackDto, picture, audio): Promise<Track> {
		const audioPath = this.fileService.createFile(FileType.AUDIO, audio)
		const imagePath = this.fileService.createFile(FileType.IMAGE, picture)
		const newTrack = await this.trackRepository.create(createTrackDto);
    	newTrack.listens = 0;
		newTrack.audio = audioPath
		newTrack.picture = imagePath
    	return this.trackRepository.save(newTrack);
	}

	async getAll(count = 10 , offset = 0): Promise<Track[]> {
		const tracks = await this.trackRepository.find({
			skip: offset,
			take: count
		});
		return tracks
	}

	async getOne(id: number): Promise<Track> {
		const track = await this.trackRepository.findOne({ where: { id } , relations: ['comments'] });
		return track
	}

	async delete(id: number): Promise<Track> {
		const track = await this.trackRepository.findOne({ where: { id } });
		if (!track) {
			throw new Error(`Track with id ${id} not found`);
		}
		const deleteTrack = await this.trackRepository.delete(id)
		return track 
	}

	async addComment(dto: CreateCommentDto): Promise<Comment> {
		// Создаем комментарий
		const comment = await this.commentRepository.create({...dto});
		await this.commentRepository.save(comment);
	
		// Получаем трек, к которому добавляем комментарий
		const track = await this.trackRepository.findOne({ where: { id: dto.trackId }, relations: ['comments'] });
	
		if (!track) {
			throw new Error(`Track with id ${dto.trackId} not found`);
		}
	
		// Загружаем комментарии для этого трека
		// await this.trackRepository.findOne({ where: { id: dto.trackId }, relations: ['comments'] });
	
		// Добавляем идентификатор комментария в массив комментариев трека
		track.comments.push(comment);
	
		// Сохраняем обновленный трек
		await this.trackRepository.save(track);
	
		return comment;
	}

	async listen(id) {
		const track = await this.trackRepository.findOne({where:{ id: id}})
		track.listens += 1
		await this.trackRepository.save(track);
	}

	async search(query): Promise<Track[]> {
		const tracks = await this.trackRepository
        .createQueryBuilder("track")
        .where("track.name LIKE :name", { name: `%${query}%` })
        .getMany();
    return tracks;
	}

}