import { create } from "zustand";

interface OpenPlayerState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useOpenPlayerStore = create<OpenPlayerState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen: isOpen }),
}));
