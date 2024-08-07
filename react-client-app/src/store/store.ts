import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./slices/rootReducer";
import { tracksApi } from "@/api/Track/TrackService";
import { authApi } from "@/api/Auth/AuthService";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(tracksApi.middleware, authApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>