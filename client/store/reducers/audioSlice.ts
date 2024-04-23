import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    playing: false,
  };
  
  const audioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
      togglePlaying(state) {
        state.playing = !state.playing;
      },
    },
  });

export default audioSlice.reducer;

export const audioReducer = audioSlice.reducer
export const audioActions = audioSlice.actions