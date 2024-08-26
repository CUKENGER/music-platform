import { IComment } from "@/types/track";

export interface ITrack {
  id:number;
  name: string,
  artist: string,
  text: string,
  listens: number;
  likes: number;
  picture: string;
  audio: string;
  comments: IComment[]; 
  duration: string;
  genre: string
}

export interface ICreateTrack {
  name: string,
  artist: string,
  text: string,
  picture: File;
  audio: File;
  genre: string
}