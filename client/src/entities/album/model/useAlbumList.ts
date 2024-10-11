import { ITrack, useGetAllAlbums } from '@/entities';
import { sortList, useInfiniteScroll } from '@/shared';
import { useEffect, useState, useMemo } from 'react';
import { IAlbum } from '../types/Album';
import { useSelectFilterStore } from '@/features';

export const useAlbumList = () => {
  const [countAlbums, setCountAlbums] = useState(20);
  const [albums, setAlbums] = useState<ITrack[]>([]);
  const { selectedSort } = useSelectFilterStore();
  const [hasMoreAlbums, setHasMoreAlbums] = useState(true);

  const { data: newAlbums, error, isError, isLoading } = useGetAllAlbums(countAlbums);

  useEffect(() => {
    if (newAlbums) {
      if (newAlbums.length === 0) {
        setHasMoreAlbums(false);
      } else {
        const newUniqueAlbums = newAlbums.filter(
          (newAlbum: IAlbum) => !albums.some((existingAlbum) => existingAlbum.id === newAlbum.id)
        );

        setAlbums((prevAlbums) => [...prevAlbums, ...newUniqueAlbums]);

        if (newUniqueAlbums.length < countAlbums) {
          setHasMoreAlbums(false);
        }
      }
    }
  }, [newAlbums]);

  const sortedAlbums = useMemo(() => {
    if (albums.length > 0) {
      return sortList(albums, selectedSort);
    }
    return albums;
  }, [selectedSort, albums]);

const {isFetching} = useInfiniteScroll(() => {
    if (hasMoreAlbums) {
      setCountAlbums((prev) => prev + 10);
    }
  });

  return {
    items: sortedAlbums,
    isLoading,
    error,
    isError,
    isLoader: isFetching,
  };
};
