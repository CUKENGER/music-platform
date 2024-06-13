import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { CreateArtistCommentDto } from "./dto/create-artistComment.dto";
import { Artist } from "./scheme/artist.schema";

@Controller('/artists')
export class ArtistController {
    constructor (private readonly artistService: ArtistService) {

    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'picture', maxCount: 1}
    ]))
    async create(@UploadedFiles() files , @Body() dto: CreateArtistDto) {

        const {picture} = files

        return this.artistService.create(dto, picture)
    }

    @Get()
    getAll(@Query('count', ParseIntPipe) count: number,
        @Query('offset', ParseIntPipe) offset: number) {
            return this.artistService.getAll(count, offset)
    }

    @Get('/search')
	searchByName(@Query('query') query: string,
				@Query('count', ParseIntPipe) count: number,
				@Query('offset', ParseIntPipe) offset: number) {
		return this.artistService.searchByName(query, count, offset)
	}

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number) {
        return this.artistService.getOne(id)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.artistService.delete(id)
    }

    @Post('/comment')
    addComment(@Body() dto: CreateArtistCommentDto) {
        return this.artistService.addComment(dto)
    }

    @Post('/listen/:id')
    addListen(@Param('id', ParseIntPipe) id: number) {
        return this.artistService.listen(id)
    }
    @Post('/like/:id')
    addLike(@Param('id', ParseIntPipe) id: number) {
        return this.artistService.addLike(id)
    }

    @Post('/unlike/:id')
    deleteLike(@Param('id', ParseIntPipe) id: number) {
        return this.artistService.deleteLike(id)
    }

    @Put(':id') // Маршрут обновления сущности, например, PUT /entities/:id
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'picture', maxCount: 1}
    ]))
    async updateArtist(
      @Param('id', ParseIntPipe) id: number, // Параметр ID из URL
      @Body() newData: Partial<Artist>, // Новые данные сущности из тела запроса
      @UploadedFiles() files
    ): Promise<Artist> {
        console.log('files',files)
        console.log('Update artist called with id:', id);
        console.log('New data:', newData);
        console.log('Files:', files);
        const picture = files?.picture ? files?.picture[0] : null;
        console.log('picture',picture)
        return this.artistService.updateArtist(id, newData, picture); // Вызов сервиса для обновления сущности
    }
}