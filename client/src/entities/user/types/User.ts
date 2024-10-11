import { IAlbum, IArtist, IComment, ITrack } from "@/entities";


export interface IUser {
  id?: number;
  username?: string;
  email: string;
  password: string;
  isActivated?: boolean;
  activationLink?: string;
  banned?: boolean;
  banReason?: string;
  roles?: Role[];
  userRoles?: string[];
  tokens?: string[];
  likedTracks?: ITrack[] | []
  likedAlbums?: IAlbum[]
  likedArtists?: IArtist[]  ;
  likedComments?: IComment[]
  listenedTracks?: ITrack[] | []
}

interface Role{
  id: number;
  role: {
    value: string
  }
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string
}

export interface LoginUserDto {
  email: string;
  password: string
}

export interface RegUserDto {
  id: number;
  isActivated: boolean;
  email: string
}

export interface RegUserResponse {
  user: RegUserDto;
  accessToken: string;
  refreshToken: string;
}
