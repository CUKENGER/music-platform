
import { createSlice } from "@reduxjs/toolkit"

export interface TrackFile {
    trackName: string;
    trackText: string;
    trackFile: null | File
}

interface addTrackState {
    addTracks: TrackFile[]
}

const initialState: addTrackState = {
    addTracks: [
        {trackName: '', trackText: '', trackFile: null},
        {trackName: '', trackText: '', trackFile: null},
        {trackName: '', trackText: '', trackFile: null},
    ]
}

export const addTrackSlice = createSlice({
    name: 'addTrack',
    initialState,
    reducers: {
        setAddTracks(state, action) {
            state.addTracks = action.payload
        }
    }
})

export default addTrackSlice.reducer
export const addTrackReducer = addTrackSlice.reducer
export const addTrackActions = addTrackSlice.actions
