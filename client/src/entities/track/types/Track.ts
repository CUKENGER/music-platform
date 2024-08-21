
export interface ITrack {
  id:number;
  name: string,
  artist: string,
  text: string,
  listens: number;
  likes: number;
  picture: string;
  audio: string;
  comments: string[]; 
  duration: string;
  genre: string
}