import { RootReducerState } from "@/app/store/rootReducer";
import { TypedUseSelectorHook, useSelector } from "react-redux";


export const useTypedSelector: TypedUseSelectorHook<RootReducerState> = useSelector