import { IAlbum, IArtist } from "@/types/track";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface searchArtistsState {
    searchArtistsInput: string;
    countArtists: number;
    offsetArtists: number;
    openedArtist: IArtist | null
}

const initialState: searchArtistsState = {
    searchArtistsInput: '',
    countArtists: 50,
    offsetArtists: 0,
    openedArtist: null,
}

export const searchArtistsSlice = createSlice({
    name: 'searchArtists',
    initialState,
    reducers: {
        setSearchArtistsInput(state, action: PayloadAction<string>) {
            state.searchArtistsInput= action.payload
        },
        setCountArtists(state, action: PayloadAction<number>) {
            state.countArtists = action.payload
        },
        setOffsetArtists(state, action: PayloadAction<number>) {
            state.offsetArtists = action.payload
        },
        SetOpenedArtist(state, action: PayloadAction<IArtist>) {
            state.openedArtist = action.payload
        }
    }
})

export default searchArtistsSlice.reducer
export const searchArtistsReducer = searchArtistsSlice.reducer
export const searchArtistsActions = searchArtistsSlice.actions