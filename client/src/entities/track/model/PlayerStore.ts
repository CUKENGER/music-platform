import { create } from "zustand";
import { ITrack } from "../types/Track";


interface PlayerStore{
  volume: number;
  activeTrack: ITrack | null;
  pause: boolean;
  setActiveTrack: (track: ITrack) => void;
  setPlay: () => void;
  setPause: () => void;
}

const usePlayerStore = create<PlayerStore>((set) => ({
  volume: 50,
  activeTrack: null,
  pause: true,
  setActiveTrack: (track: ITrack) => set({ activeTrack: track }),
  setPlay: () => set({pause: false}),
  setPause: () => set({pause: true})
}));

export default usePlayerStore