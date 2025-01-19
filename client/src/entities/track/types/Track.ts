import { IArtist } from "@/entities/artist/types/Artist";
import { IUser } from "@/entities/user/types/User";

export interface ITrack {
  id: number;
  name: string,
  artist: IArtist,
  text: string,
  listens: number;
  likes: number;
  picture: string;
  audio: string;
  comments: string[]; 
  duration: string;
  genre: string;
  likedByUsers: IUser[] | []
}

export interface CreateTrackDto {
  name: string;
  artist: string;
  text: string;
  genre: string;
  picture: File;
  audio: File
}

export interface TrackUpdateState {
  id?: number;
  name: string;
  text: string;
  audio: File | null;
  isUpdated: boolean,
  isNew: boolean;
  isExist: boolean
}

export interface TrackState {
  name: string;
  text: string;
  audio: File | null;
}
