import { combineReducers } from "@reduxjs/toolkit";
import { counterReducer } from "./counterSlice";


export const rootReducer = combineReducers({
  counterReducer
})


export type RootReducerState = ReturnType<typeof rootReducer>