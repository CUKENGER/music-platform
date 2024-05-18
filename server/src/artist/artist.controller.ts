import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ArtistService } from "./artist.service";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { CreateArtistCommentDto } from "./dto/create-artistComment.dto";


@Controller('/artists')
export class ArtistController {
    constructor (private readonly artistService: ArtistService) {

    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'picture', maxCount: 1}
    ]))
    async create(@UploadedFiles() files , @Body() dto: CreateArtistDto) {

        console.log('files',files);
        const {picture} = files

        return this.artistService.create(dto, picture)
    }

    @Get()
    getAll(@Query('count') count: number,
        @Query('offset') offset: number) {
            return this.artistService.getAll(count, offset)
    }

    @Get('/search')
	searchByName(@Query('query') query: string,
				@Query('count') count: number,
				@Query('offset') offset: number) {
		return this.artistService.searchByName(query, count, offset)
	}

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.artistService.getOne(id)
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.artistService.delete(id)
    }

    @Post('/comment')
    addComment(@Body() dto: CreateArtistCommentDto) {
        return this.artistService.addComment(dto)
    }

    @Post('/listen/:id')
    addListen(@Param('id') id: number) {
        return this.artistService.listen(id)
    }
    @Post('/like/:id')
    addLike(@Param('id') id: number) {
        return this.artistService.addLike(id)
    }

    @Post('/unlike/:id')
    deleteLike(@Param('id') id: number) {
        return this.artistService.deleteLike(id)
    }
}