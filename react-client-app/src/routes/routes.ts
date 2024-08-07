import Tracks from "@/pages/Tracks";
import Index from "../pages/Index/Index";
import Albums from "@/pages/Albums";
import Artists from "@/pages/Artists";
import CreateTrack from "@/components/TracksPage/CreateTrack";
import Login from "@/pages/Auth/Login";
import Registration from "@/pages/Auth/Registration";
import GoActivation from "@/pages/Auth/GoActivation";

export enum PrivateRoutes {
  HOME = '/',
  TRACKS = '/tracks',
  CREATE_TRACK = '/tracks/create',
  ALBUMS = '/albums',
  ARTISTS = '/artists'
}

export enum PublicRoutes {
  LOGIN = '/login',
  REGISTRATION = '/registration',
  ACTIVATION = '/activation'
}

export const privateRoutes =[
  {path: PrivateRoutes.HOME, component: Index, exact:true},
  {path: PrivateRoutes.TRACKS, component: Tracks, exact:true},
  {path: PrivateRoutes.CREATE_TRACK, component: CreateTrack, exact:true},
  {path: PrivateRoutes.ALBUMS, component: Albums, exact:true},
  {path: PrivateRoutes.ARTISTS, component: Artists, exact:true},
]


export const publicRoutes = [
  { path: PublicRoutes.LOGIN, component: Login, exact: true },
  { path: PublicRoutes.REGISTRATION, component: Registration, exact: true },
  { path: PublicRoutes.ACTIVATION, component: GoActivation, exact: true },
];