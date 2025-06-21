import { create } from 'zustand';

interface SelectFilterState {
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
}

export const useSelectFilterStore = create<SelectFilterState>((set) => ({
  selectedSort: 'Все',
  setSelectedSort: (sort: string) => set({ selectedSort: sort }),
}));
