import { AlbumPage, Albums, ArtistPage, ArtistPopularTracks, Artists, CreateAlbum, CreateArtist, CreateTrack, GoActivation, Home, Login, PrivateNotFound, Profile, Registration, ResetPassword, SendEmail, Tracks, ArtistEdit, AlbumEdit} from "@/pages";
import { PublicNotFound } from "@/pages/PublicNotFound";

export enum PRIVATE_ROUTES {
  HOME = '/',
  TRACKS = '/tracks',
  CREATE_TRACK = '/tracks/create',
  CREATE_ALBUM = '/albums/create',
  CREATE_ARTIST = '/artists/create',
  ALBUMS = '/albums',
  ARTISTS = '/artists',
  PROFILE = '/profile/:id',
  NOT_FOUND = "*",
  ARTIST_EDIT = '/artists/:id/edit',
  ALBUM_EDIT = '/albums/:id/edit'
}

export enum PUBLIC_ROUTES {
  LOGIN = '/',
  REGISTRATION = '/registration',
  ACTIVATION = '/goActivate', 
  SEND_EMAIL = '/send_email',
  NOT_FOUND = "*"
}

export const privateRoutes = [
  {path: PRIVATE_ROUTES.HOME, component: Home, exact:true},
  {path: PRIVATE_ROUTES.TRACKS, component: Tracks, exact:true},
  {path: PRIVATE_ROUTES.CREATE_TRACK, component: CreateTrack, exact:true},
  {path: PRIVATE_ROUTES.ALBUMS, component: Albums, exact:true},
  {path: PRIVATE_ROUTES.ARTISTS, component: Artists, exact:true},
  {path: PRIVATE_ROUTES.PROFILE, component: Profile, exact:true},
  {path: PRIVATE_ROUTES.CREATE_ALBUM, component: CreateAlbum, exact:true},
  {path: PRIVATE_ROUTES.NOT_FOUND, component: PrivateNotFound, exact:true},
  {path: PRIVATE_ROUTES.CREATE_ARTIST, component: CreateArtist, exact:true},
  {path: '/albums/:id', component: AlbumPage, exact: true},
  {path: '/artists/:id', component: ArtistPage, exact: true},
  {path: '/artists/:id/popular_tracks', component: ArtistPopularTracks, exact: true},
  {path: PRIVATE_ROUTES.ARTIST_EDIT, component: ArtistEdit, exact: true},
  {path: PRIVATE_ROUTES.ALBUM_EDIT, component: AlbumEdit, exact: true}
]

export const publicRoutes = [
  { path: PUBLIC_ROUTES.LOGIN, component: Login, exact: true },
  { path: PUBLIC_ROUTES.REGISTRATION, component: Registration, exact: true },
  { path: PUBLIC_ROUTES.ACTIVATION, component: GoActivation, exact: true },
  { path: '/reset_password/:token', component: ResetPassword, exact: true },
  { path: PUBLIC_ROUTES.SEND_EMAIL, component: SendEmail, exact: true },
  { path: PUBLIC_ROUTES.NOT_FOUND, component: PublicNotFound, exact: true },
];
