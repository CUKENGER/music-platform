import { combineReducers } from "@reduxjs/toolkit";
import { counterActions, counterReducer } from "./counterSlice";
import { dropdownActions, dropdownReducer } from "./dropdownSlice";
import { tracksApi } from "@/api/Track/TrackService";
import { playerActions, playerReducer } from "./playerSlice";
import { trackTimeActions, trackTimeReducer } from "./trackTimeSlice";
import { activeTrackListActions, activeTrackListReducer } from "./activeTrackListSlice";
import { authActions, authReducer } from "./authSlice";
import { authApi } from "@/api/Auth/AuthService";

export const rootReducer = combineReducers({
  counterReducer,
  dropdownReducer,
  playerReducer,
  trackTimeReducer,
  activeTrackListReducer,
  authReducer,
  [tracksApi.reducerPath]: tracksApi.reducer,
  [authApi.reducerPath]: authApi.reducer
})

export const AllActions ={
  ...counterActions,
	...dropdownActions,
	...playerActions,
	...trackTimeActions,
	...activeTrackListActions,
	...authActions
}


export type RootReducerState = ReturnType<typeof rootReducer>