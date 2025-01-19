import { Album, Track, User} from "@prisma/client";


export interface IAlbum extends Album {
  tracks: Track[];
  likedByUsers: User[]
}