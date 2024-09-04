import { ITrack, useActiveTrackListStore, useGetAllTracks } from '@/entities';
import useSelectFilterStore from '@/features/SelectFilter/model/SelectFilterStore';
import { sortList, useInfiniteScroll } from '@/shared';
import { useEffect, useState, useCallback, useMemo } from 'react';

export const useTrackList = () => {
  const [countTracks, setCountTracks] = useState(20);
  const [offsetTracks, setOffsetTracks] = useState(0);
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const { setActiveTrackList } = useActiveTrackListStore();
  const { selectedSort } = useSelectFilterStore();
  const [hasMoreTracks, setHasMoreTracks] = useState(true);

  const { data: newTracks, error, isError, isLoading } = useGetAllTracks(countTracks, offsetTracks);

  useEffect(() => {
    if (newTracks && newTracks.length > 0) {
      const newUniqueTracks = newTracks.filter(
        (newTrack: ITrack) => !tracks.some((existingTrack) => existingTrack.id === newTrack.id)
      );
  
      setTracks((prevTracks) => {
        const updatedTracks = [...prevTracks, ...newUniqueTracks];
        if (newUniqueTracks.length < countTracks) {
          setHasMoreTracks(false);
        }
        return updatedTracks;
      });
    } else {
      setHasMoreTracks(false);
    }
  }, [newTracks, countTracks]);

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

  const isLoader = useInfiniteScroll(() => {
    if (hasMoreTracks) {
      setCountTracks((prev) => prev + 10);
      setOffsetTracks((prev) => prev + 10);
    }
  });

  return {
    tracks,
    isLoading,
    error,
    isError,
    hasMoreTracks,
    isLoader,
  };
};
