import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { CreateArtistCommentDto } from "./dto/create-artistComment.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller('/artists')
export class ArtistController {
    constructor(private readonly artistService: ArtistService) {

    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 }
    ]))
    async create(@UploadedFiles() files, @Body() dto: CreateArtistDto) {

        const { picture } = files

        return this.artistService.create(dto, picture)
    }

    @Get()
	@ApiOperation({ summary: 'Получение всех артистов с пагинацией' })
	async getAll(@Query('count') count?: number, @Query('cursor') offset?: number) {
		return await this.artistService.getAll(offset, count);
	}

    @Get('/search')
    searchByName(@Query('name') name: string) {
        return this.artistService.searchByName(name)
    }

    @Get(':id')
    getOne(@Param('id') id) {
        return this.artistService.getOne(id)
    }

    @Delete(':id')
    delete(@Param('id') id) {
        return this.artistService.delete(id)
    }

    @Post('/comment')
    addComment(@Body() dto: CreateArtistCommentDto) {
        return this.artistService.addComment(dto)
    }

    @Post('/listen/:id')
    addListen(@Param('id') id) {
        return this.artistService.listen(id)
    }

    @Post('/like/:id')
    addLike(@Param('id') id) {
        return this.artistService.addLike(id)
    }

    @Delete('/like/:id')
    deleteLike(@Param('id') id) {
        return this.artistService.deleteLike(id)
    }

    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 }
    ]))
    async updateArtist(
        @Param('id') id,
        @Body() newData,
        @UploadedFiles() files
    ) {
        const picture = files?.picture ? files?.picture[0] : null;
        return this.artistService.updateArtist(id, newData, picture);
    }

}