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

  const { data: newTracks, error, isError, isLoading } = useGetAllTracks(countTracks);

  useEffect(() => {
    if (newTracks && newTracks.length > 0) {
      const newUniqueTracks = newTracks.filter(
        (newTrack: ITrack) => !tracks.some((existingTrack) => existingTrack.id === newTrack.id)
      );
  
      setTracks((prevTracks) => [...prevTracks, ...newUniqueTracks]);
  
      if (newUniqueTracks.length < 15) {
        setHasMoreTracks(false);
      }
    } else if (newTracks && newTracks.length === 0) {
      setHasMoreTracks(false);
    }
  }, [newTracks]);

  const sortedTracks = useMemo(() => {
    if (tracks.length > 0) {
      return sortList(tracks, selectedSort);
    }
    return tracks;
  }, [selectedSort, tracks]);

  const memoizedSetActiveTrackList = useCallback(() => {
    setActiveTrackList(sortedTracks);
  }, [setActiveTrackList, sortedTracks]);

  useEffect(() => {
    memoizedSetActiveTrackList();
  }, [memoizedSetActiveTrackList]);

  console.log('count', countTracks)

  console.log('hsmore', hasMoreTracks)

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
