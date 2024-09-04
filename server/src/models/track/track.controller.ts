import { Controller, Get, Post, Body, Param, Delete, UploadedFiles, Query, ParseIntPipe, UseInterceptors, Put, Next, InternalServerErrorException, Req, UnauthorizedException, NotFoundException } from '@nestjs/common';
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

	constructor(
		private readonly trackService: TrackService,
	) {}

	@Post()
	@UseInterceptors(FileFieldsInterceptor([
		{ name: 'picture', maxCount: 1 },
		{ name: 'audio', maxCount: 1 },
	]))
	@ApiOperation({ summary: 'Создание трека' })
  @ApiBody({ type: CreateTrackDto })
	async create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {

		console.log('files', files)
		console.log('dto', dto)
		const { picture, audio } = files;


		if (!audio || !picture) {
			throw new InternalServerErrorException('Audio and picture are required');
		}
		return await this.trackService.create(dto, picture, audio)
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
	getOne(@Param('id', ParseIntPipe) id: number) {
		return this.trackService.getOne(id)
	}

	@Get()
	@ApiOperation({ summary: 'Получение всех треков с пагинацией' })
	async getAll(@Query('count') count?: number, @Query('cursor') offset?: number) {
		return await this.trackService.getAll(offset, count);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удаление трека по id' })
	delete(@Param('id') id: number) {
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
	async addListen(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      throw new UnauthorizedException('User not authenticated');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.trackService.listen(id, token);
  }

	@Post('/like/:id')
	@ApiOperation({ summary: 'Добавление лайка к треку по id' })
	addLike(@Param('id', ParseIntPipe ) id: number, @Req() req: Request) {
		try {
			const authHeader = req.headers['authorization'];
			
			if (!authHeader) {
				throw new UnauthorizedException('User not authenticated');
			}
	
			const token = authHeader.split(' ')[1];
			if (!token) {
				throw new UnauthorizedException('User not authenticated');
			}
			return this.trackService.addLike(id, token)
		} catch(e) {
			throw new Error(`Error add like to track: ${e}`)
		}
	}

	@Delete('/like/:id')
	@ApiOperation({ summary: 'Удаление лайка к треку по id' })
	deleteLike(@Param('id', ParseIntPipe ) id: number, @Req() req: Request) {
		const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      throw new UnauthorizedException('User not authenticated');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('User not authenticated');
    }
		return this.trackService.deleteLike(id, token)
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