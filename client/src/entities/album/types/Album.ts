import { ITrack, TrackState } from "@/entities";

export interface IAlbum {
  id: number;
  name: string;
  artist: {name: string};
  genre: string;
  description: string;
  createdAt: string;
  likes: number;
  listens: number;
  picture: string;
  releaseDate: string;
  duration: string;
  tracks: [] | ITrack[]
}

export interface CreateAlbumDto {
  artist: string
  name: string;
  picture?: string | File;
  tracks: TrackState[];
  track_names: string[];
  track_texts: string[]
  genre: string
  description: string;
  releaseDate: string
}