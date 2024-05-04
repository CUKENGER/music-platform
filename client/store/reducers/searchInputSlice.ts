import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface searchInputState {
    searchInput: string;
    countTracks: number;
    offsetTracks: number
}

const initialState: searchInputState = {
    searchInput: '',
    countTracks: 30,
    offsetTracks: 0,
}

export const searchInputSlice = createSlice({
    name: 'searchInput',
    initialState,
    reducers: {
        setSearchInput(state, action: PayloadAction<string>) {
            state.searchInput= action.payload
        },
        setCountTracks(state, action: PayloadAction<number>) {
            state.countTracks = action.payload
        },
        setOffsetTracks(state, action: PayloadAction<number>) {
            state.offsetTracks = action.payload
        },
    }
})

export default searchInputSlice.reducer
export const searchInputReducer = searchInputSlice.reducer
export const searchInputActions = searchInputSlice.actions