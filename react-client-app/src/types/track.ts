
export interface IComment {
  trackId: number;
  username: string;
  text: string
  id: number
  replies: [];
  likes: number 
  createDate: Date
}

export type ICreateComment = Omit<IComment, 'id'| 'replies' | 'likes' | 'createDate'>

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

// export type ICreateTrack = Omit<ITrack, 'id' | 'listens' | 'likes' | 'comments' | 'duration'>

export interface ICreateTrack {
  name: string,
  artist: string,
  text: string,
  picture: File;
  audio: File;
  genre: string
}