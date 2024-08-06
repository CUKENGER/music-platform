import Tracks from "@/pages/Tracks";
import Index from "../pages/Index/Index";
import Albums from "@/pages/Albums";
import Artists from "@/pages/Artists";
import CreateTrack from "@/components/TracksPage/CreateTrack";
import Login from "@/pages/Auth/Login";
import Registration from "@/pages/Auth/Registration";

export const privateRoutes =[
  {path: '/', component: Index, exact:true},
  {path: '/tracks', component: Tracks, exact:true},
  {path: '/tracks/create', component: CreateTrack, exact:true},
  {path: '/albums', component: Albums, exact:true},
  {path: '/artists', component: Artists, exact:true},
]


export const publicRoutes = [
  { path: '/login', component: Login, exact: true },
  { path: '/registration', component: Registration, exact: true },
];