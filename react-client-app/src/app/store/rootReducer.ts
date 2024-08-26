import { authApi } from "@/api/Auth/AuthService";
import { tracksApi } from "@/api/Track/TrackService";
import { combineReducers } from "@reduxjs/toolkit";
import { activeTrackListActions, activeTrackListReducer } from "../../entities/track/model/activeTrackListSlice";
import { playerActions, playerReducer } from "../../entities/track/model/playerSlice";
import { trackTimeActions, trackTimeReducer } from "../../entities/track/model/trackTimeSlice";
import { authActions, authReducer } from "../../store/slices/authSlice";
import { counterActions, counterReducer } from "../../store/slices/counterSlice";
import { dropdownActions, dropdownReducer } from "../../store/slices/dropdownSlice";

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