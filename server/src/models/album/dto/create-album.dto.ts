
export class CreateAlbumDto {
    artist: string
    name: string;
    picture?: string;
    tracks?: any[];
    track_names: string[];
    track_texts: string[]
    genre: string
}