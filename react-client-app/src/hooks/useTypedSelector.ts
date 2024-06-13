'use client'

import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootReducerState } from "../store/slices/rootReducer";


export const useTypedSelector: TypedUseSelectorHook<RootReducerState> = useSelector