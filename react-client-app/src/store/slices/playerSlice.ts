import { ITrack } from '@/types/track';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface PlayerState {
  activeTrack: ITrack | null;
  currentTime: number,
  duration: number;
  pause: boolean;
  volume: number;
  activeTrackList: ITrack[] | null;
}

const initialState: PlayerState = {
  activeTrack: null,
  currentTime: 0,
  duration: 0,
  pause: true,
  volume: 50,
  activeTrackList: null
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlay: (state) => {
      state.pause = false
    },
    setPause: (state) => {
      state.pause = true;
    },
    setActiveTrack(state, action: PayloadAction<ITrack>) {
      if (state.activeTrack?.id !== action.payload.id) {
        state.activeTrack = action.payload;
      }
    },
    setCurrentTime(state, action: PayloadAction<number>) {
      state.currentTime = action.payload
    },
    setDuration(state, action : PayloadAction<number>){
      state.duration = action.payload
    },
    setVolume(state, action: PayloadAction<number>){
      state.volume = action.payload
    },
    setActiveTrackList(state, action: PayloadAction<ITrack[]>) {
      state.activeTrackList = action.payload
    }
  },
});

export const playerActions = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
export default playerSlice.reducer;