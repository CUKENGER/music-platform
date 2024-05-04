import { Track } from "src/track/scheme/track.schema";

export class CreateAlbumDto {
    artist: string
    name: string;
    picture: string;
    tracks: Track[];
}