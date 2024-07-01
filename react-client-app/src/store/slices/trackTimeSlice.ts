import { PayloadAction, createSlice } from "@reduxjs/toolkit";



interface TrackTimeState {
  currentTime: number;
  duration: number;
}

const initialState: TrackTimeState = {
  currentTime: 0,
  duration: 0
}

export const trackTimeSlice = createSlice({
  name: 'trackTime',
  initialState,
  reducers: {
    setCurrentTime(state, action: PayloadAction<number>) {
      state.currentTime = action.payload
    },
    setDuration(state, action: PayloadAction<number>){
      state.duration = action.payload
    },
},
})

export const trackTimeActions = trackTimeSlice.actions;
export const trackTimeReducer = trackTimeSlice.reducer;
export default trackTimeSlice.reducer;