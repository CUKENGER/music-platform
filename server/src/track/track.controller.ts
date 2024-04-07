import {Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, Query} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('/tracks')
export class TrackController {

	constructor(private readonly trackService: TrackService) {

	}


	@Post()
	@UseInterceptors(FileFieldsInterceptor([
		{name: 'picture', maxCount: 1},
		{name: 'audio', maxCount: 1},

	]))
	create(@UploadedFiles() files ,@Body() createTrackDto: CreateTrackDto) {
		const {picture, audio} = files
		
		if (!picture || !audio) {
			throw new Error('Picture and audio files are required');
			console.log('Файлы не загружены')
		}
		return this.trackService.create(createTrackDto, picture[0], audio[0])
	}

	@Get()
	getAll(@Query('count') count: number,
			@Query('offset') offset: number) {
		return this.trackService.getAll(count, offset)
	}

	@Get('/search')
	search(@Query('query') query: string) {
		return this.trackService.search(query)
	}

	@Get(':id')
	getOne(@Param('id') id: number ) {
		return this.trackService.getOne(id)
	}

	@Delete(':id')
	delete(@Param('id') id: number ) {
		return this.trackService.delete(id)
	}

	@Post('/comment')
	addComment(@Body() dto: CreateCommentDto) {
		return this.trackService.addComment(dto)
	}

	@Post('/listen/:id')
	addListen(@Param('id') id: number) {
		return this.trackService.listen(id)
	}
	

}