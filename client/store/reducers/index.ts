import {combineReducers} from "redux";
import playerReducer from "./playerReducer";
import { uploadPictureReducer } from "./uploadPictureSlice";
import { audioReducer } from "./audioSlice";
import { dropdownReducer } from "./dropdownSlice";
import { windowReducer } from "./windowSlice";
import { searchInputReducer } from "./searchInputSlice";
import { commentApi } from "@/api/Track/CommentService";
import { tracksApi } from "@/api/Track/TrackService";
import { addTrackReducer } from "./addTrackSlice";
import { albumsApi } from "@/api/Album/AlbumService";
import { searchAlbumsReducer } from "./searchAlbumsSlice";
import { searchArtistsReducer } from "./searchArtistsSlice";
import { artistsApi } from "@/api/Artist/ArtistService";



export const rootReducer = combineReducers({
    playerReducer,
    audioReducer,
    uploadPictureReducer,
    dropdownReducer,
    windowReducer,
    searchInputReducer,
    addTrackReducer,
    searchAlbumsReducer,
    searchArtistsReducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [tracksApi.reducerPath]: tracksApi.reducer,
    [albumsApi.reducerPath]: albumsApi.reducer,
    [artistsApi.reducerPath]: artistsApi.reducer,
})

// export const reducer = (state, action) => {
//     if (action.type === HYDRATE) {
//         const nextState = {
//             ...state, // use previous state
//             ...action.payload, // apply delta from hydration
//         }
//         if (state.count) nextState.count = state.count // preserve count value on client side navigation
//         return nextState
//     } else {
//         return rootReducer(state, action)
//     }
// }

export type RootState = ReturnType<typeof rootReducer>