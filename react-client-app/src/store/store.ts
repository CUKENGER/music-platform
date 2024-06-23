import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./slices/rootReducer";
import { tracksApi } from "@/api/Track/TrackService";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(tracksApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>