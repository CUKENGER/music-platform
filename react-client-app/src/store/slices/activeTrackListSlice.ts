import { ITrack } from '@/types/track';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IState {
  activeTrackList: ITrack[] | null;
}

const initialState: IState = {
  activeTrackList: null
};

export const activeTrackListSlice = createSlice({
  name: 'activeTrackList',
  initialState,
  reducers: {
    setActiveTrackList(state, action: PayloadAction<ITrack[]>) {
      state.activeTrackList = action.payload
    }
  },
});

export const activeTrackListActions = activeTrackListSlice.actions;
export const activeTrackListReducer = activeTrackListSlice.reducer;
export default activeTrackListSlice.reducer;