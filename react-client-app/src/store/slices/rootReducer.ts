import { combineReducers } from "@reduxjs/toolkit";
import { counterReducer } from "./counterSlice";
import { dropdownReducer } from "./dropdownSlice";
import { tracksApi } from "@/api/Track/TrackService";
import { playerReducer } from "./playerSlice";

export const rootReducer = combineReducers({
  counterReducer,
  dropdownReducer,
  playerReducer,
  [tracksApi.reducerPath]: tracksApi.reducer
})


export type RootReducerState = ReturnType<typeof rootReducer>