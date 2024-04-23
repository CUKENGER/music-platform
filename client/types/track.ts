export interface IComment {
    trackId: number | undefined;
    username: string;
    text: string
}

export interface ITrack {
    id: number,
    name: string,
    artist: string,
    text: string,
    listens: number;
    picture: string;
    audio: string;
    active?: boolean;
    comments: IComment[]; 
}


export interface TrackState {
    tracks: ITrack[];
    error: string;
}
