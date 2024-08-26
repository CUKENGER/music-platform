import { Track } from "@prisma/client";

export class CreateTracksDto {
    name: string;
    text: string;
    tracks?: Track[];
    genre: string
}