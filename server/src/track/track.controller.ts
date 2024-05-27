import {Controller, Get, Post, Body, Param, Delete, UploadedFiles, Query, ParseIntPipe, UseInterceptors} from '@nestjs/common';
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
		{ name: 'picture', maxCount: 1 },
		{ name: 'audio', maxCount: 1 },
	  ]))
  	async create(@UploadedFiles() files, @Body() createTrackDto: CreateTrackDto) {
		const { picture, audio } = files;

		if (!audio || !picture) {
			throw new Error('audio and picture are required');
		}
        return this.trackService.create(createTrackDto, picture, audio)
  	}	

	@Get()
	getAll(@Query('count', ParseIntPipe) count: number,
			@Query('offset', ParseIntPipe) offset: number) {
		return this.trackService.getAll(count, offset)
	}

	@Get('/search')
	searchByName(@Query('query') query: string,
				@Query('count', ParseIntPipe) count: number,
				@Query('offset', ParseIntPipe) offset: number) {
		return this.trackService.searchByName(query, count, offset)
	}

	@Get(':id')
	getOne(@Param('id', ParseIntPipe) id: number ) {
		return this.trackService.getOne(id)
	}

	@Delete(':id')
	delete(@Param('id', ParseIntPipe) id: number ) {
		return this.trackService.delete(id)
	}

	@Post('/comment')
	addComment(@Body() dto: CreateCommentDto) {
		return this.trackService.addComment(dto)
	}

	@Post('/listen/:id')
	addListen(@Param('id',ParseIntPipe) id: number) {
		return this.trackService.listen(id)
	}

	@Post('/likes/:id')
	addLikes(@Param('id', ParseIntPipe) id: number) {
		return this.trackService.addLikes(id)
	}

}