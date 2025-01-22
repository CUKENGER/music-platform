import { create } from 'zustand';

interface OpenCommentsState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useOpenCommentsStore = create<OpenCommentsState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen: isOpen }),
}));
