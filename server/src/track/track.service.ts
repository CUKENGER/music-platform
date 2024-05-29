import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { Track } from './scheme/track.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { FileService, FileType } from 'src/file/file.service';
import * as fs from 'fs'
import { Artist } from 'src/artist/scheme/artist.schema';
import { ArtistService } from 'src/artist/artist.service';
import { AudioService } from 'src/audioService/audioService.service';
import * as path from "path";
import { TrackComment } from './scheme/trackComment.schema';
import { CreateTrackCommentDto } from './dto/create-trackComment-dto';
import { CreateReplyTrackCommentDto } from './dto/create-trackReplyComment.dto';
import { TrackReplyComment } from './scheme/trackReplyComment.schema';

@Injectable()
export class TrackService {

	constructor(
		@InjectRepository(Track) 
		private trackRepository: Repository<Track>,
		@InjectRepository(TrackComment) 
		private commentRepository: Repository<TrackComment>,
		@InjectRepository(TrackReplyComment)
		private replyCommentRepository: Repository<TrackReplyComment>,
		private fileService: FileService,
		private audioService: AudioService,
		@InjectRepository(Artist)
		private artistRepository: Repository<Artist>,
		private artistService: ArtistService
	) {

	}

	async create(createTrackDto: CreateTrackDto, picture, audio): Promise<string> {
		if (picture && audio) {
			const audioPathPromise = this.fileService.createFile(FileType.AUDIO, audio);
            const imagePathPromise = this.fileService.createFile(FileType.IMAGE, picture);

            const [audioPath, imagePath] = await Promise.all([audioPathPromise, imagePathPromise]);

			const duration = await this.audioService.getAudioDuration(audioPath)
	
			const newTrack = this.trackRepository.create(createTrackDto);
			newTrack.listens = 0;
			newTrack.likes = 0;
			newTrack.genre = createTrackDto.genre;
			newTrack.audio = audioPath;
			newTrack.picture = imagePath;
			newTrack.duration = duration;
			newTrack.artist = createTrackDto.artist
	
			// Проверка на существование артиста
			let artist = await this.artistRepository.findOne({ where: { name: createTrackDto.artist } });
	
			if (!artist) {
				const artistDto = {
					name: createTrackDto.artist,
					genre: '',
					description: '',
				};
				artist = await this.artistService.create(artistDto, picture);
			}
	
			newTrack.artistEntity = artist; // Привязка артиста к треку
	
			await this.trackRepository.save(newTrack);
			return JSON.stringify({ id: newTrack.id, name: newTrack.name });
		} else {
			return JSON.stringify('Файлы не загружены');;
		}
	}

	async getAll(count:number, offset:number): Promise<Track[]> {
		const tracks = await this.trackRepository.find({
			skip: offset,
			take: count,
			relations: ['comments', 'album', 'artistEntity', 'comments.replies']
		});
		return tracks
	}

	async getOne(id: number): Promise<Track> {
		const track = await this.trackRepository.findOne({
			 where: { id } ,
			 relations: ['comments', 'album', 'artistEntity', 'comments.replies'] 
			});
		return track
	}

	async delete(id: number): Promise<Track> {
		const track = await this.trackRepository.findOne({ where: { id } });
		if (!track) {
			throw new Error(`Track with id ${id} not found`);
		}
		// Удаление связанных файлов
		if (track.picture) {
			try {
				const picturePath = path.resolve('static/', track.picture); // Путь к файлу изображения
				fs.unlinkSync(picturePath); 
			} catch(e) {
				console.log(e)
			}
		} 
		if (track.audio) {
			try{
				const audioPath = path.resolve('static/', track.audio); // Путь к аудиофайлу
				fs.unlinkSync(audioPath);
			} catch(e) {
				console.log(e)
			}
		}

		// Удаление связанных комментариев
		await this.commentRepository.delete({ trackId: id });

		// Удаление трека
		await this.trackRepository.delete(id)

		return track;
	}

	async addComment(dto: CreateTrackCommentDto): Promise<TrackComment> {
		// Создаем комментарий
		const comment = await this.commentRepository.create({
			username: dto.username,
			text: dto.text,
			trackId: dto.trackId,
			createDate: new Date()
		});
		await this.commentRepository.save(comment);
	
		// Получаем трек, к которому добавляем комментарий
		const track = await this.trackRepository.findOne({ where: { id: dto.trackId }, relations: ['comments'] });
	
		if (!track) {
			throw new Error(`Track with id ${dto.trackId} not found`);
		}
	
		// Загружаем комментарии для этого трека
		await this.trackRepository.findOne({ where: { id: dto.trackId }, relations: ['comments'] });
	
		// Добавляем идентификатор комментария в массив комментариев трека
		track.comments.push(comment);
	
		// Сохраняем обновленный трек
		await this.trackRepository.save(track);
	
		return comment;
	}

	async addReplyToComment(dto: CreateReplyTrackCommentDto): Promise<TrackReplyComment> {
		// Создаем комментарий
		const comment = await this.commentRepository.findOne({where: {id: dto.commentId}, relations: ['replies']})
		if (!comment) {
			throw new NotFoundException(`Comment with id ${dto.commentId} not found`);
		}
		const reply = await this.replyCommentRepository.create({
			username: dto.username,
			text: dto.text,
			commentId: dto.commentId,
			createDate: new Date()
		})

		comment.replies.push(reply)
		await this.commentRepository.save(comment)
		await this.replyCommentRepository.save(reply)
	
		return reply;
	}

	async listen(id) {
		try {
			const track = await this.trackRepository.findOne({ where: { id: id } });
			if (track) {
				track.listens += 1;
				await this.trackRepository.save(track);
				return track.id; // Возвращаем обновленный объект трека
			} else {
				throw new Error(`Track with id ${id} not found`);
			}
		} catch (e) {
			console.log(e);
			throw e; // Пробрасываем исключение дальше, чтобы его можно было обработать в вызывающем коде
		}
	}

	async searchByName(query: string, count: number, offset: number): Promise<Track[]> {
		const tracks = await this.trackRepository
        .createQueryBuilder('track')
		.leftJoinAndSelect('track.comments', 'comments')
		.leftJoinAndSelect('track.album', 'album')
		.leftJoinAndSelect('comments.replies', 'commentReplies')
        .where('LOWER(track.name) LIKE LOWER(:name)', { name: `%${query}%` })
		.skip(offset)
		.take(count)
        .getMany();

    	return tracks;
	}

	async addLikes(id) {
		try {
			const track = await this.trackRepository.findOne({ where: { id: id } });
			if (track) {
				track.likes += 1;
				await this.trackRepository.save(track);
				return track.id; // Возвращаем обновленный объект трека
			} else {
				throw new Error(`Track with id ${id} not found`);
			}
		} catch (e) {
			console.log(e);
			throw e; // Пробрасываем исключение дальше, чтобы его можно было обработать в вызывающем коде
		}
	}

	async addLikesComment(id) {
		try {
			const comment = await this.commentRepository.findOne({where: {id: id}})
			if (comment) {
				comment.likes += 1;
				await this.commentRepository.save(comment);
				return comment.id; // Возвращаем обновленный объект трека
			} else {
				throw new Error(`Comment with id ${id} not found`);
			}
		} catch (e) {
			console.log(e);
			throw e; // Пробрасываем исключение дальше, чтобы его можно было обработать в вызывающем коде
		}
	}

	async deleteLikesComment(id) {
		try {
			const comment = await this.commentRepository.findOne({where: {id: id}})
			if (comment) {
				comment.likes -= 1;
				await this.commentRepository.save(comment);
				return comment.id; // Возвращаем обновленный объект трека
			} else {
				throw new Error(`Comment with id ${id} not found`);
			}
		} catch (e) {
			console.log(e);
			throw e; // Пробрасываем исключение дальше, чтобы его можно было обработать в вызывающем коде
		}
	}

	async addLikesCommentReply(id) {
		try {
			const reply = await this.replyCommentRepository.findOne({where: {id: id}})
			if (reply) {
				reply.likes += 1;
				await this.replyCommentRepository.save(reply);
				return reply.id; // Возвращаем обновленный объект трека
			} else {
				throw new Error(`Reply with id ${id} not found`);
			}
		} catch (e) {
			console.log(e);
			throw e; // Пробрасываем исключение дальше, чтобы его можно было обработать в вызывающем коде
		}
	}

	async deleteLikesCommentReply(id) {
		try {
			const reply = await this.replyCommentRepository.findOne({where: {id: id}})
			if (reply) {
				reply.likes -= 1;
				await this.replyCommentRepository.save(reply);
				return reply.id; // Возвращаем обновленный объект трека
			} else {
				throw new Error(`Reply with id ${id} not found`);
			}
		} catch (e) {
			console.log(e);
			throw e; // Пробрасываем исключение дальше, чтобы его можно было обработать в вызывающем коде
		}
	}



}