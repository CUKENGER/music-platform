import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './scheme/track.schema';
import { Comment } from './scheme/comment.schema';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TrackService {

	constructor(
		@InjectRepository(Track) 
		private trackRepository: Repository<Track>,
		@InjectRepository(Comment) 
		private commentRepository: Repository<Comment>) {

	}

	async create(createTrackDto: CreateTrackDto): Promise<Track> {
		const newTrack = this.trackRepository.create(createTrackDto);
    	newTrack.listens = 0;
    	return this.trackRepository.save(newTrack);
	}

	async getAll() {

	}

	async getOne() {
		
	}

	async delete() {
		
	}

}