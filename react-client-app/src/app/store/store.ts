import { authApi } from "@/api/Auth/AuthService";
import { tracksApi } from "@/api/Track/TrackService";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";


export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(tracksApi.middleware, authApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>