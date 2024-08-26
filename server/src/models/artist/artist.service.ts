import { ConflictException, Injectable } from "@nestjs/common";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { CreateArtistCommentDto } from "./dto/create-artistComment.dto";
import * as path from 'path';
import * as fs from 'fs/promises'
import { ArtistFileService, ArtistFileType } from "./artistFile/artistFile.service";
import { UpdateArtistDto } from "./dto/update-artist.dto";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class ArtistService {
    constructor(
        private prisma: PrismaService,
        private artistFileService: ArtistFileService,
    ) {}

    async create(dto: CreateArtistDto, picture) {
        const existingArtist = await this.prisma.artist.findFirst({where: {name: dto.name}});
        if (existingArtist) {
            throw new ConflictException('Artist with this name already exists');
        }

        const imagePath = this.artistFileService.createCover(ArtistFileType.IMAGE, picture);

        const newArtist = await this.prisma.artist.create({
            data: {
                ...dto,
                listens: 0,
                likes: 0,
                picture: imagePath,
                tracks: {
                    create: [],
                },
                albums: {
                    create: [],
                }
            },
            include: {
                tracks: true,
                albums: true,
            }
        });

        return newArtist;
    }
    
    async getAll() {
        return await this.prisma.artist.findMany({
            include: {
                tracks: true,
                comments: true,
                albums: true,
            },
        });
    }

    async listen(id: string) {
        const artist = await this.prisma.artist.findUnique({ where: { id } });
        if (!artist) {
            throw new Error(`Artist with id ${id} not found`);
        }

        return await this.prisma.artist.update({
            where: { id },
            data: { listens: artist.listens + 1 },
        });
    }

    async addLike(id: string) {
        const artist = await this.prisma.artist.findUnique({ where: { id } });
        if (!artist) {
            throw new Error(`Artist with id ${id} not found`);
        }

        return await this.prisma.artist.update({
            where: { id },
            data: { likes: artist.likes + 1 },
        });
    }

    async deleteLike(id: string) {
        const artist = await this.prisma.artist.findUnique({ where: { id } });
        if (!artist) {
            throw new Error(`Artist with id ${id} not found`);
        }

        return await this.prisma.artist.update({
            where: { id },
            data: { likes: artist.likes - 1 },
        });
    }

    async getOne(id: string) {
        return await this.prisma.artist.findUnique({
            where: { id },
            include: {
                tracks: true,
                albums: {
                    include: {
                        tracks: true,
                    },
                },
            },
        });
    }

    async addComment(dto: CreateArtistCommentDto) {
        const artist = await this.prisma.artist.findUnique({
            where: { id: dto.artistId },
            include: {
                comments: true,
            },
        });

        if (!artist) {
            throw new Error(`Artist with id ${dto.artistId} not found`);
        }

        const comment = await this.prisma.comment.create({
            data: {
                ...dto,
                artistId: dto.artistId,
            },
        });

        return comment;
    }

    async delete(id: string) {
        const artist = await this.prisma.artist.findUnique({ where: { id } });
        if (!artist) {
            throw new Error(`Artist with id ${id} not found`);
        }

        if (artist.picture) {
            try {
                const picturePath = path.resolve('static/', artist.picture);
                await fs.unlink(picturePath);
            } catch (error) {
                console.error(`Error deleting picture for artist ${id}:`, error);
            }
        }

        await this.prisma.comment.deleteMany({ where: { artistId: id } });
        await this.prisma.track.deleteMany({ where: { artistId: id } });
        await this.prisma.album.deleteMany({ where: { artistId: id } });
        await this.prisma.artist.delete({ where: { id } });

        return artist;
    }

    async searchByName(query: string, count = 50, offset = 0) {
        return await this.prisma.artist.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            skip: offset,
            take: count,
            include: {
                tracks: true,
                comments: true,
                albums: {
                    include: {
                        tracks: true,
                    },
                },
            },
        });
    }

    async updateArtist(id: string, newData: Partial<UpdateArtistDto>, picture) {
        let imagePath;
        if (picture) {
            imagePath = this.artistFileService.createCover(ArtistFileType.IMAGE, picture);
            newData.picture = imagePath;
        }

        const updatedArtist = await this.prisma.artist.update({
            where: { id },
            data: {
                ...newData,
                picture: imagePath || undefined,
            },
        });

        return updatedArtist;
    }
}