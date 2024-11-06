import { ITrack, useActiveTrackListStore, useGetAllTracks } from '@/entities';
import { useSelectFilterStore } from '@/features';
import { sortList, useInfiniteScroll } from '@/shared';
import { useEffect, useState, useCallback, useMemo } from 'react';

export const useTrackList = () => {
  const [countTracks, setCountTracks] = useState(15);
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const { setActiveTrackList } = useActiveTrackListStore();
  const { selectedSort } = useSelectFilterStore();
  const [hasMoreTracks, setHasMoreTracks] = useState(true);

  const { data: newTracks, error, isError, isLoading } = useGetAllTracks(0, countTracks);

  useEffect(() => {
    if (newTracks) {
      const newUniqueTracks = newTracks.filter(
        (newTrack: ITrack) => !tracks.some((existingTrack) => existingTrack.id === newTrack.id)
      );

      if (newUniqueTracks.length > 0) {
        setTracks((prevTracks) => [...prevTracks, ...newUniqueTracks]);
      }
      
      setHasMoreTracks(newUniqueTracks.length === countTracks);
    }
  }, [newTracks, countTracks]);

  const sortedTracks = useMemo(() => {
    return sortList(tracks, selectedSort);
  }, [selectedSort, tracks]);

  const memoizedSetActiveTrackList = useCallback(() => {
    setActiveTrackList(sortedTracks);
  }, [setActiveTrackList, sortedTracks]);

  useEffect(() => {
    memoizedSetActiveTrackList();
  }, [memoizedSetActiveTrackList]);

  useInfiniteScroll(() => {
    if (hasMoreTracks) {
      setCountTracks((prev) => prev + 3);
    }
  });

  return {
    items: sortedTracks,
    isLoading,
    error,
    isError,
  };
};
