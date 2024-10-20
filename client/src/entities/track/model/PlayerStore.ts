import { create } from "zustand";
import { ITrack } from "../types/Track";

interface PlayerStore{
  volume: number;
  activeTrack: ITrack | null;
  pause: boolean;
  isMix: boolean;
  setIsMix: (isMix: boolean) => void;
  setActiveTrack: (track: ITrack) => void;
  setPlay: () => void;
  setPause: () => void;
  setVolume: (volume: number) => void
}

const usePlayerStore = create<PlayerStore>((set) => ({
  volume: 100,
  activeTrack: null,
  pause: true,
  isMix: false,
  setIsMix: (isMix: boolean) => set({isMix: isMix}),
  setActiveTrack: (track: ITrack) => set({ activeTrack: track }),
  setPlay: () => set({pause: false}),
  setPause: () => set({pause: true}),
  setVolume: (volume: number) => set({volume: volume})
}));

export default usePlayerStore