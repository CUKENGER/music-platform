import { Artist } from "@/entities/artist/types/Artist";
import { IUser } from "@/entities/user/types/User";

export interface ITrack {
  id: number;
  name: string,
  artist: Artist,
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