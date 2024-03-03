import {Controller, Get, Post, Body} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';

@Controller('/tracks')
export class TrackController {

	constructor(private readonly trackService: TrackService) {

	}


	@Post()
	create(@Body() createTrackDto: CreateTrackDto) {
		return this.trackService.create(createTrackDto)
	}

	@Get()
	getAll() {
		return 'work'
	}

	getOne() {
		
	}

	delete() {

	}

}