import { ITrack, TrackItem, useGetAllTracks, useTrackList } from '@/entities';
import { PrivateRoutes } from '@/shared';
import { ItemList } from '@/widgets';
import styles from './Tracks.module.scss'

// export const Tracks = () => {
//   return (
//     <ItemList 
//       className={styles.TrackList}
//       useItemListHook={useTrackList} 
//       ItemComponent={TrackItem} 
//       createRoute={PrivateRoutes.CREATE_TRACK} 
//     />
//   );
// }

import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

export const Tracks = () => {
  const [page, setPage] = useState(0);
  const [allTracks, setAllTracks] = useState<ITrack[]>([]); // Состояние для хранения всех треков
  const { data, isLoading, isError } = useGetAllTracks(page);

  // Проверка на наличие следующей страницы
  const hasNextPage = data && data.length === 15; // Предполагаем, что API возвращает 20 треков

  const fetchMoreTracks = () => {
    if (hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  // Эффект для добавления новых треков к уже существующим
  useEffect(() => {
    if (data) {
      setAllTracks((prevTracks: ITrack[]) => [...prevTracks, ...data]); // Накапливаем треки
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading tracks.</div>;

  return (
    <InfiniteScroll
      dataLength={allTracks.length} // длина текущего массива данных
      next={fetchMoreTracks} // функция для загрузки новых данных
      hasMore={hasNextPage ?? false} // условие для определения, есть ли еще данные для загрузки
      loader={<div>Loading more tracks...</div>} // отображаемый элемент во время загрузки
    >
      {allTracks.map((track) => (
        <div key={track.id} style={{ height: '50px', backgroundColor: 'gray', marginBottom: '10px' }}>
          {track.name}
        </div> // Убедитесь, что track.id уникален
      ))}
    </InfiniteScroll>
  );
};

