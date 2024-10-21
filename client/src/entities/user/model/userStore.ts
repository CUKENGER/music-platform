import { create } from "zustand";
import { IUser } from "../types/User";

interface UserState {
  isAuth: boolean;
  user: IUser | null;
  isAdmin: boolean
  setUser: (user: IUser | undefined) => void
  setIsAuth: (auth: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => set({ isAdmin: isAdmin}),
  isAuth: !!localStorage.getItem('token'),
  setIsAuth: (auth: boolean) => set({ isAuth: auth }),
  user: null,
  setUser: (user: IUser | undefined) => set ({user: user})
}));
