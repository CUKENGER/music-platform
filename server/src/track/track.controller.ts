import {Controller, Get, Post, Body, Param, Delete, UploadedFiles, Query, ParseIntPipe, UseInterceptors, Put} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateTrackCommentDto } from './dto/create-trackComment-dto';
import { CreateReplyTrackCommentDto } from './dto/create-trackReplyComment.dto';
import { Track } from './scheme/track.schema';



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
	addComment(@Body() dto: CreateTrackCommentDto) {
		return this.trackService.addComment(dto)
	}

	@Post('/comment/replies')
	addReplyToComment(@Body() dto: CreateReplyTrackCommentDto) {
		return this.trackService.addReplyToComment(dto)
	}

	@Post('/listen/:id')
	addListen(@Param('id',ParseIntPipe) id: number) {
		return this.trackService.listen(id)
	}

	@Post('/likes/:id')
	addLikes(@Param('id', ParseIntPipe) id: number) {
		return this.trackService.addLikes(id)
	}

	@Post('/comment/like/:id')
	addLikesComment(@Param('id', ParseIntPipe) id: number) {
		return this.trackService.addLikesComment(id)
	}

	@Post('/comment/dislike/:id')
	deleteLikesComment(@Param('id', ParseIntPipe) id: number) {
		return this.trackService.deleteLikesComment(id)
	}

	@Post('/comment/reply/like/:id')
	addLikesCommentReply(@Param('id', ParseIntPipe) id: number) {
		return this.trackService.addLikesCommentReply(id)
	}

	@Post('/comment/reply/dislike/:id')
	deleteLikesCommentReply(@Param('id', ParseIntPipe) id: number) {
		return this.trackService.deleteLikesCommentReply(id)
	}

	@Put(':id')
	@UseInterceptors(FileFieldsInterceptor([
		{name: 'picture', maxCount: 1},
		{name: 'audio', maxCount: 1},
	]))
	async updateTrack(
		@Param('id', ParseIntPipe) id: number,
		@Body() newData: Partial<Track>,
		@UploadedFiles() files
	):Promise<Track> {
		const {picture, audio} = files
		return this.trackService.updateTrack(id, newData, picture, audio)
	}

}