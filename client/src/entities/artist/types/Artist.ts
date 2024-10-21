import { IAlbum } from "@/entities/album/types/Album";
import { ITrack } from "@/entities/track/types/Track";

export interface IArtist {
  id: number;
  name: string;
  picture: string | File;
  listens: number;
  likes: number;
  genre: string
  description: string
  albums: IAlbum[];
  tracks: ITrack[]
}

export interface CreateArtistDto {
  name: string;
  genre: string;
  description: string;
  picture: File
}