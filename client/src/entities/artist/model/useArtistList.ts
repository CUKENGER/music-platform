import { IArtist, useGetAllArtists} from '@/entities';
import { useSelectFilterStore } from '@/features';
import { sortList, useInfiniteScroll } from '@/shared';
import { useEffect, useState, useMemo } from 'react';

export const useArtistList = () => {
  const [countArtist, setCountArtist] = useState(20);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const { selectedSort } = useSelectFilterStore();
  const [hasMoreArtist, setHasMoreArtist] = useState(true);

  const { data: newArtists, error, isError, isLoading } = useGetAllArtists(countArtist);

  useEffect(() => {
    if (newArtists) {
      if (newArtists.length === 0) {
        setHasMoreArtist(false);
      } else {
        const newUniqueArtists = newArtists.filter(
          (newArtist: IArtist) => !artists.some((existingArtist) => existingArtist.id === newArtist.id)
        );

        setArtists((prevArtists) => [...prevArtists, ...newUniqueArtists]);

        if (newUniqueArtists.length < countArtist) {
          setHasMoreArtist(false);
        }
      }
    }
  }, [newArtists]);

  const sortedArtists = useMemo(() => {
    if (artists.length > 0) {
      return sortList(artists, selectedSort);
    }
    return artists;
  }, [selectedSort, artists]);

  useInfiniteScroll(() => {
    if (hasMoreArtist) {
      setCountArtist((prev) => prev + 10);
    }
  });

  return {
    items: sortedArtists,
    isLoading,
    error,
    isError,
  };
};
