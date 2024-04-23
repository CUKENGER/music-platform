import { PlayerState } from "@/types/player"
import { ITrack } from "@/types/track"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"


const initialState: PlayerState = {
    activeTrack: null,
    currentTime: 0,
    duration: 0,
    pause: true,
    volume: 50,
    active: false,
    openedTrack: null
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        playerPlay(state) {
            state.pause = false
            state.active = false
        },

        playerPause(state) {
            state.pause = true
            state.active = true
        },

        playerSetActiveTrack(state, action: PayloadAction<ITrack> ) {
            state.activeTrack = action.payload
            state.duration = 0
            state.currentTime = 0
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
        }
    }
})

export default playerSlice.reducer
export const playerReducer = playerSlice.reducer
export const playerActions = playerSlice.actions
