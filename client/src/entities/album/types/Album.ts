import { IArtist } from "@/entities/artist";
import { IComment } from "@/entities/comment";
import { ITrack, TrackState, TrackUpdateState } from "@/entities/track";

export interface IAlbum {
  id: number;
  name: string;
  artist: IArtist;
  genre: string;
  description: string;
  createdAt: string;
  likes: number;
  listens: number;
  picture: string;
  releaseDate: string;
  duration: string;
  comments: IComment[];
  tracks: [] | ITrack[];
}

export interface CreateAlbumDto {
  artist: string;
  name: string;
  picture?: string | File;
  tracks: TrackState[];
  track_names: string[];
  track_texts: string[];
  genre: string;
  description: string;
  releaseDate: string;
}

export interface EditAlbumDto {
  artist: string;
  name: string;
  picture?: string | File | undefined | null;
  tracks?: TrackUpdateState[];
  track_names: string[];
  track_texts: string[];
  deletedTracks: TrackUpdateState[];
  genre: string;
  description: string;
  releaseDate: string;
}
