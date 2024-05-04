import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface dropdownState {
    selectedSort: string
}

const initialState: dropdownState = {
    selectedSort: 'Все'
}

export const dropdownSlice = createSlice({
    name: 'dropdown',
    initialState,
    reducers: {
        setSelectedSort(state, action: PayloadAction<string>) {
            state.selectedSort = action.payload
        }
    }
})

export default dropdownSlice.reducer
export const dropdownReducer = dropdownSlice.reducer
export const dropdownActions = dropdownSlice.actions