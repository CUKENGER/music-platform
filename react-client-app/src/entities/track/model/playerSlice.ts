import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ITrack } from './types/track';

interface PlayerState {
  activeTrack: ITrack | null;
  pause: boolean;
  volume: number;
}

const initialState: PlayerState = {
  activeTrack: null,
  pause: true,
  volume: 50
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
      state.activeTrack = action.payload;
    },
    setVolume(state, action: PayloadAction<number>){
      state.volume = action.payload
    }
  },
});

export const playerActions = playerSlice.actions;
export const playerReducer = playerSlice.reducer;
export default playerSlice.reducer;