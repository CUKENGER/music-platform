import { create } from 'zustand';

interface AudioChunkStore {
  loadedTime: number;
  start: number;
  end: number;
  fileSize: number;
  isChunkExist: boolean;
  chunkDuration: number;
  setChunkDuration: (chunkDuration: number) => void;
  setIsChunkExist: (is: boolean) => void;
  setFileSize: (size: number) => void;
  setStart: (n: number) => void;
  setEnd: (n: number) => void;
  setLoadedTime: (time: number) => void;
}

const useAudioChunkStore = create<AudioChunkStore>((set) => ({
  loadedTime: 0,
  start: 0,
  end: 999999,
  fileSize: 0,
  isChunkExist: false,
  chunkDuration: 0,
  setChunkDuration: (chunkDuration: number) => set({ chunkDuration: chunkDuration }),
  setIsChunkExist: (is: boolean) => set({ isChunkExist: is }),
  setFileSize: (size: number) => set({ fileSize: size }),
  setStart: (n: number) => set({ start: n }),
  setEnd: (n: number) => set({ end: n }),
  setLoadedTime: (time: number) => set({ loadedTime: time }),
}));

export default useAudioChunkStore;
