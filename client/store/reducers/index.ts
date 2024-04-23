import {combineReducers} from "redux";
import {HYDRATE} from "next-redux-wrapper";
import playerReducer from "./playerReducer";
import { tracksApi } from "@/services/TrackService";
import { uploadPictureReducer } from "./uploadPictureSlice";
import { audioReducer } from "./audioSlice";
import { commentApi } from "@/services/CommentService";



export const rootReducer = combineReducers({
    playerReducer,
    audioReducer,
    uploadPictureReducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [tracksApi.reducerPath]: tracksApi.reducer
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