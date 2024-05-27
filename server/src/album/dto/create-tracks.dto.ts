import { Track } from "src/track/scheme/track.schema";

export class CreateTracksDto {
    name: string;
    text: string;
    tracks?: Track[];
    genre: string
}