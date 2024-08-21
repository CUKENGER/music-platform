import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

interface AppProviderProps {
  children: ReactNode
}

const queryClient = new QueryClient()

export const AppProvider:FC<AppProviderProps> = ({children}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
} 