import Tracks from "@/pages/Tracks";
import Index from "../pages/Index/Index";
import Albums from "@/pages/Albums";
import Artists from "@/pages/Artists";
import CreateTrack from "@/components/TracksPage/CreateTrack";



export const publicRoutes =[
  {path: '/', component: Index, exact:true},
  {path: '/tracks', component: Tracks, exact:true},
  {path: '/tracks/create', component: CreateTrack, exact:true},
  {path: '/albums', component: Albums, exact:true},
  {path: '/artists', component: Artists, exact:true},
]