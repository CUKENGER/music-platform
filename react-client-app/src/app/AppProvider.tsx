import { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider:FC<AppProviderProps> = ({children}) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )
} 