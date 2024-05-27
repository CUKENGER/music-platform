import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { AlbumService } from "./album.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { CreateAlbumCommentDto } from "./dto/create-albumComment.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";


@Controller('/albums')
export class AlbumController {
    constructor(private readonly albumService: AlbumService) {

    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'picture', maxCount: 1},
        {name: 'tracks'}
    ]))
    async create(@UploadedFiles() files , @Body() dto: CreateAlbumDto) {
        return this.albumService.create(dto, files)
    }

    @Get()
    getAll(@Query('count', ParseIntPipe) count: number,
        @Query('offset', ParseIntPipe) offset: number) {
            return this.albumService.getAll(count, offset)
    }

    @Get('/search')
	searchByName(@Query('query') query: string,
				@Query('count', ParseIntPipe) count: number,
				@Query('offset', ParseIntPipe) offset: number) {
		return this.albumService.searchByName(query, count, offset)
	}

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number) {
        return this.albumService.getOne(id)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.albumService.delete(id)
    }

    @Post('/comment')
    addComment(@Body() dto: CreateAlbumCommentDto) {
        return this.albumService.addComment(dto)
    }

    @Post('/listen/:id')
    addListen(@Param('id',ParseIntPipe) id: number) {
        return this.albumService.listen(id)
    }
}