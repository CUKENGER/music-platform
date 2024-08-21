import { create } from "zustand";
import { IUser } from "../types/User";

interface UserState {
  isAuth: boolean;
  user: IUser | null;
  setUser: (user: IUser | undefined) => void
  setIsAuth: (auth: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isAuth: !!localStorage.getItem('token'),
  setIsAuth: (auth: boolean) => set({ isAuth: auth }),
  user: null,
  setUser: (user: IUser | undefined) => set ({user: user})
}));
