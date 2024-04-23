import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface UploadPictureState {
    uploadPicture: string | null
}

const initialState: UploadPictureState = {
    uploadPicture: ''
}

export const uploadPictureSlice = createSlice({
    name: 'uploadPicture',
    initialState,
    reducers: {
        setUploadPicture(state, action: PayloadAction<string>) {
            state.uploadPicture= action.payload
        }
    }
})

export default uploadPictureSlice.reducer
export const uploadPictureReducer = uploadPictureSlice.reducer
export const uploadPictureActions = uploadPictureSlice.actions