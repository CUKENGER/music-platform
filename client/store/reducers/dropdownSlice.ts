import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface dropdownState {
    selectedSort: string;
    isNavbarOpen: boolean
}

const initialState: dropdownState = {
    selectedSort: 'Все',
    isNavbarOpen: false
}

export const dropdownSlice = createSlice({
    name: 'dropdown',
    initialState,
    reducers: {
        setSelectedSort(state, action: PayloadAction<string>) {
            state.selectedSort = action.payload
        },
        setIsNavbarOpen(state, action: PayloadAction<boolean>) {
            state.isNavbarOpen = action.payload
        }
    }
})

export default dropdownSlice.reducer
export const dropdownReducer = dropdownSlice.reducer
export const dropdownActions = dropdownSlice.actions