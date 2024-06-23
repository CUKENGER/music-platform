import { PayloadAction, createSlice } from "@reduxjs/toolkit";


interface DropDownState {
  selectedSort: string
}

const initialState: DropDownState = {
  selectedSort: 'Все'
};

export const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {
    setSelectedSort(state, action:PayloadAction<string>) {
      state.selectedSort = action.payload
    }
  },
});


export  const dropdownActions = dropdownSlice.actions
export const dropdownReducer = dropdownSlice.reducer

export default dropdownSlice.reducer