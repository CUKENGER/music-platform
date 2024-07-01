import { combineReducers } from "@reduxjs/toolkit";
import { counterReducer } from "./counterSlice";
import { dropdownReducer } from "./dropdownSlice";
import { tracksApi } from "@/api/Track/TrackService";
import { playerReducer } from "./playerSlice";
import { trackTimeReducer } from "./trackTimeSlice";
import { activeTrackListReducer } from "./activeTrackListSlice";

export const rootReducer = combineReducers({
  counterReducer,
  dropdownReducer,
  playerReducer,
  trackTimeReducer,
  activeTrackListReducer,
  [tracksApi.reducerPath]: tracksApi.reducer
})


export type RootReducerState = ReturnType<typeof rootReducer>