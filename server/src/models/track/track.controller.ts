import { Controller, Get, Post, Body, Param, Delete, UploadedFiles, Query, ParseIntPipe, UseInterceptors, Put } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateTrackCommentDto } from './dto/create-trackComment-dto';
import { CreateReplyTrackCommentDto } from './dto/create-trackReplyComment.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Track } from '@prisma/client';

@ApiTags('Tracks')
@Controller('/tracks')
export class TrackController {

	constructor(private readonly trackService: TrackService) {}

	@Post()
	@UseInterceptors(FileFieldsInterceptor([
		{ name: 'picture', maxCount: 1 },
		{ name: 'audio', maxCount: 1 },
	]))
	@ApiOperation({ summary: 'Создание трека' })
  @ApiBody({ type: CreateTrackDto })
	async create(@UploadedFiles() files, @Body() createTrackDto: CreateTrackDto) {
		const { picture, audio } = files;

		if (!audio || !picture) {
			throw new Error('audio and picture are required');
		}
		return this.trackService.create(createTrackDto, picture, audio)
	}

	@Get('/search')
	@ApiOperation({ summary: 'Поиск треков' })
	searchByName(@Query('query') query: string,
		@Query('count', ParseIntPipe) count: number,
		@Query('offset', ParseIntPipe) offset: number) {
		return this.trackService.searchByName(query, count, offset)
	}


	@Get(':id')
	@ApiOperation({ summary: 'Получение трека по id' })
	getOne(@Param('id') id) {
		return this.trackService.getOne(id)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удаление трека по id' })
	delete(@Param('id',) id) {
		return this.trackService.delete(id)
	}

	@Post('/comment')
	@ApiOperation({ summary: 'Создание коммента к треку' })
	addComment(@Body() dto: CreateTrackCommentDto) {
		return this.trackService.addComment(dto)
	}

	@ApiOperation({ summary: 'Создание ответа к комменту трека' })
	@Post('/comment/replies')
	addReplyToComment(@Body() dto: CreateReplyTrackCommentDto) {
		return this.trackService.addReplyToComment(dto)
	}

	@Post('/listen/:id')
	@ApiOperation({ summary: 'Добавление прослушивания к треку по id' })
	addListen(@Param('id' ) id) {
		return this.trackService.listen(id)
	}

	@Post('/like/:id')
	@ApiOperation({ summary: 'Добавление лайка к треку по id' })
	addLike(@Param('id' ) id) {
		return this.trackService.addLike(id)
	}

	@Delete('/like/:id')
	@ApiOperation({ summary: 'Удаление лайка к треку по id' })
	deleteLike(@Param('id') id) {
		return this.trackService.deleteLike(id)
	}

	@Put(':id')
	@ApiOperation({ summary: 'Обновление трека' })
	@UseInterceptors(FileFieldsInterceptor([
		{ name: 'picture', maxCount: 1 },
		{ name: 'audio', maxCount: 1 },
	]))
	async updateTrack(
		@Param('id') id,
		@Body() newData: Partial<Track>,
		@UploadedFiles() files
	): Promise<Track> {
		const { picture, audio } = files
		return this.trackService.updateTrack(id, newData, picture, audio)
	}

}