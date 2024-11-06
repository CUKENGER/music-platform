import { create } from "zustand";
import { ITrack } from "../types/Track";

interface PlayerStore {
  volume: number;
  activeTrack: ITrack | null;
  pause: boolean;
  isMix: boolean;
  setIsMix: (isMix: boolean) => void;
  setActiveTrack: (track: ITrack) => void;
  setPlay: () => void;
  setPause: () => void;
  setVolume: (volume: number) => void;
}

const usePlayerStore = create<PlayerStore>((set, get) => ({
  volume: 100,
  activeTrack: null,
  pause: true,
  isMix: false,
  
  setIsMix: (isMix: boolean) => {
    if (get().isMix !== isMix) {
      set({ isMix });
    }
  },
  
  setActiveTrack: (track: ITrack) => {
    if (get().activeTrack?.id !== track.id) {
      set({ activeTrack: track });
    }
  },
  
  setPlay: () => set({ pause: false }),
  
  setPause: () => set({ pause: true }),
  
  setVolume: (volume: number) => {
    if (get().volume !== volume) {
      set({ volume });
    }
  }
}));

export default usePlayerStore;
