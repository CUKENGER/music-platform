import { IAlbum } from "@/entities/album";
import { IArtist } from "@/entities/artist";
import { IComment } from "@/entities/comment";
import { ITrack } from "@/entities/track";

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
  likedTracks?: ITrack[] | [];
  likedAlbums?: IAlbum[];
  likedArtists?: IArtist[];
  likedComments?: IComment[];
  listenedTracks?: ITrack[] | [];
}

interface Role {
  id: number;
  role: {
    value: string;
  };
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface RegUserDto {
  id: number;
  isActivated: boolean;
  email: string;
}

export interface RegUserResponse {
  statusCode: number;
  message: string;
  user: {
    email: string;
    username: string
  }
}

export interface LoginUserResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    isActivated: boolean;
  }
}

export interface CheckUsernameResponse {
  available: boolean;
}

export interface SendEmailDto {
  email: string;
}

export interface SendEmailResponse {
  message: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}
