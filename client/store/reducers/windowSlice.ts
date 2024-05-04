import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface windowState {
    windowWidth: number
}

const initialState: windowState= {
    windowWidth: 1920
}

export const windowSlice = createSlice({
    name: 'window',
    initialState,
    reducers: {
        setWindowWidth(state, action: PayloadAction<number>) {
            state.windowWidth = action.payload
        }
    }
})

export default windowSlice.reducer
export const windowReducer = windowSlice.reducer
export const windowActions = windowSlice.actions