import { create } from 'zustand';
import { ITrack } from '../types/Track';

interface ActiveTrackLIstStore {
  activeTrackList: ITrack[] | null;
  setActiveTrackList: (trackList: ITrack[]) => void;
}

const useActiveTrackListStore = create<ActiveTrackLIstStore>((set) => ({
  activeTrackList: null,
  setActiveTrackList: (trackList: ITrack[]) => set({ activeTrackList: trackList }),
}));

export default useActiveTrackListStore;
