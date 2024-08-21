import { create } from "zustand";

interface TrackTimeStore{
  currentTime: number;
  duration: string | number
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void
}

const useTrackTimeStore = create<TrackTimeStore>((set) => ({
  currentTime: 0,
  duration: 0,
  setCurrentTime: (time: number) => set({currentTime: time}),
  setDuration: (duration: number) => set({ duration: duration }),
}));

export default useTrackTimeStore