import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { Album } from "./album.schema";
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

        const {picture, tracks} = files

        if (!tracks || !picture) {
			throw new Error('files are required');
		}


        return this.albumService.create(dto, picture, tracks)
    }

    @Get()
    getAll(@Query('count') count: number,
        @Query('offset') offset: number) {
            return this.albumService.getAll(count, offset)
    }

    @Get()
    search(@Query('query') query: string) {
        return this.albumService.search(query)
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.albumService.getOne(id)
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.albumService.delete(id)
    }

    @Post('/comment')
    addComment(@Body() dto: CreateAlbumCommentDto) {
        return this.albumService.addComment(dto)
    }

    @Post('/listen/:id')
    addListen(@Param('id') id: number) {
        return this.albumService.listen(id)
    }
}