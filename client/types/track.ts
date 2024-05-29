export interface IComment {
    trackId: number | undefined;
    username: string;
    text: string
    id: number
    replies: IReplyToComment[] | [];
    likes?: number 
    createDate?: Date
}

export interface IReplyToComment {
    commentId: number;
    username: string;
    text: string
    id: number;
    likes: number
}

export interface ITrack {
    id:number;
    name: string,
    artist: string,
    text: string,
    listens: number;
    likes: number;
    picture: string | null | File;
    audio: string | null | File;
    active?: boolean;
    comments: IComment[]; 
    duration?: string
}

export interface AudioFile {
    name?: string;
    text?: string;
}

export interface IAlbum {
    id:number;
    name: string;
    artist: string;
    description: string;
    releaseDate: string;
    listens: number;
    picture: File;
    likes: number;
    tracks: ITrack[];
    comments?: IComment[]
}

export interface IArtist {
    data: any;
    id:number;
    name: string;
    description: string;
    genre: string;
    likes: number;
    listens: number;
    picture?: File;
    tracks?: ITrack[];
    comments?: IComment[];
    albums?: IAlbum[]
}

