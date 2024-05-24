import { PlayerState } from "@/types/player"
import { ITrack } from "@/types/track"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"

const initialState: PlayerState = {
    activeTrack: null,
    currentTime: 0,
    duration: 0,
    pause: true,
    volume: 50,
    openedTrack: null,
    activeTrackList: [],
    isOpenPlayerDetailed: false,
    defaultTrackList: [],
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        playerPlay(state) {
            state.pause = false
        },

        playerPause(state) {
            state.pause = true
        },

        playerSetActiveTrack(state, action: PayloadAction<ITrack> ) {
            state.activeTrack = action.payload
            // state.duration = 0
            // state.currentTime = 0
        },

        playerSetCurrentTime(state, action: PayloadAction<number> ) {
            state.currentTime = action.payload
        },

        playerSetDuration(state, action: PayloadAction<number> ) {
            state.duration = action.payload
        },

        playerSetVolume(state, action: PayloadAction<number> ) {
            state.volume = action.payload
        },
        setOpenedTrack(state, action: PayloadAction<ITrack>) {
            state.openedTrack = action.payload
        },
        setActiveTrackList(state, action: PayloadAction<ITrack[]>) {
            state.activeTrackList = action.payload
        },
        setIsOpenPlayerDetailed(state, action: PayloadAction<boolean>) {
            state.isOpenPlayerDetailed = action.payload
        },
        setDefaultTrackList(state, action: PayloadAction<ITrack[]>) {
            state.defaultTrackList = action.payload
        }
    }
})

export default playerSlice.reducer
export const playerReducer = playerSlice.reducer
export const playerActions = playerSlice.actions
