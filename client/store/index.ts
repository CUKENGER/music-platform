import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './reducers'
import { Context, createWrapper } from 'next-redux-wrapper'
import { tracksApi } from '@/services/TrackService'
import { setupListeners } from '@reduxjs/toolkit/query'
import { commentApi } from '@/services/CommentService'

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(tracksApi.middleware, commentApi.middleware)

})

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>

// Создаем makeStore функцию
const makeStore = (context: Context) => store;

// Экспортируем обертку
export const wrapper = createWrapper(makeStore, {debug: true});

