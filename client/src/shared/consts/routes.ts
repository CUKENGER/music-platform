import { AlbumPage, Albums, Artists, CreateAlbum, CreateArtist, CreateTrack, GoActivation, Home, Login, PrivateNotFound, Profile, Registration, Tracks} from "@/pages";
import { PublicNotFound } from "@/pages/PublicNotFound/PublicNotFound";

export enum PrivateRoutes {
  HOME = '/',
  TRACKS = '/tracks',
  CREATE_TRACK = '/tracks/create',
  CREATE_ALBUM = '/albums/create',
  CREATE_ARTIST = '/artists/create',
  ALBUMS = '/albums',
  ARTISTS = '/artists',
  PROFILE = '/profile/:id',
  NOT_FOUND = "*"
}

export enum PublicRoutes {
  LOGIN = '/',
  REGISTRATION = '/registration',
  ACTIVATION = '/goActivate', 
  NOT_FOUND = "*"
}

export const privateRoutes = [
  {path: PrivateRoutes.HOME, component: Home, exact:true},
  {path: PrivateRoutes.TRACKS, component: Tracks, exact:true},
  {path: PrivateRoutes.CREATE_TRACK, component: CreateTrack, exact:true},
  {path: PrivateRoutes.ALBUMS, component: Albums, exact:true},
  {path: PrivateRoutes.ARTISTS, component: Artists, exact:true},
  {path: PrivateRoutes.PROFILE, component: Profile, exact:true},
  {path: PrivateRoutes.CREATE_ALBUM, component: CreateAlbum, exact:true},
  {path: PrivateRoutes.NOT_FOUND, component: PrivateNotFound, exact:true},
  {path: PrivateRoutes.CREATE_ARTIST, component: CreateArtist, exact:true},
  {path: '/albums/:id', component: AlbumPage, exact: true}
]


export const publicRoutes = [
  { path: PublicRoutes.LOGIN, component: Login, exact: true },
  { path: PublicRoutes.REGISTRATION, component: Registration, exact: true },
  { path: PublicRoutes.ACTIVATION, component: GoActivation, exact: true },
  { path: PublicRoutes.NOT_FOUND, component: PublicNotFound, exact: true },
];