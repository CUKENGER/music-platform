import { IAlbum } from "@/types/track";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface searchAlbumsState {
    searchAlbumsInput: string;
    countAlbums: number;
    offsetAlbums: number;
    openedAlbum: IAlbum | null
}

const initialState: searchAlbumsState = {
    searchAlbumsInput: '',
    countAlbums: 30,
    offsetAlbums: 0,
    openedAlbum: null,
}

export const searchAlbumsSlice = createSlice({
    name: 'searchAlbums',
    initialState,
    reducers: {
        setSearchAlbumsInput(state, action: PayloadAction<string>) {
            state.searchAlbumsInput= action.payload
        },
        setCountAlbums(state, action: PayloadAction<number>) {
            state.countAlbums = action.payload
        },
        setOffsetAlbums(state, action: PayloadAction<number>) {
            state.offsetAlbums = action.payload
        },
        SetOpenedAlbum(state, action: PayloadAction<IAlbum>) {
            state.openedAlbum = action.payload
        }
    }
})

export default searchAlbumsSlice.reducer
export const searchAlbumsReducer = searchAlbumsSlice.reducer
export const searchAlbumsActions = searchAlbumsSlice.actions