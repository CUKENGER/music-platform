// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean
}

const initialState: AuthState = {
  isLoggedIn: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true
    }
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authSlice.reducer;