import { useEffect, useCallback, useState } from 'react';
import { ITrack } from '../types/Track';
import { useGetAudioChunks } from '../api/useTrackApi';
import playerManager from './PlayerManager';
import { ChunkData } from './AudioChunkLoader';

export const useChunkLoader = (track: ITrack | null, currentTime: number) => {
  const [chunkIndex, setChunkIndex] = useState(0);
  const [isChunkLoading, setIsChunkLoading] = useState(false);
  const filename = track?.audio.split('/').slice(1).join('') ?? '';
  const { start, end } = playerManager.getChunkParams(chunkIndex);

  const { data, error, isLoading } = useGetAudioChunks(filename, start, end);

  const loadChunk = useCallback(async () => {
    if (track && !isLoading && !isChunkLoading && data) {
      setIsChunkLoading(true);
      console.log('Loading chunk:', { start, end, data });
      try {
        await playerManager.loadChunkIfNeeded(currentTime, async () => {
          console.log('data loadChunkIfNeeded', data);
          setChunkIndex((prev) => prev + 1);
          return data as ChunkData;
        });
      } finally {
        setIsChunkLoading(false);
      }
    }
  }, [data, isLoading, track, currentTime, start, end, isChunkLoading]);

  // Удаляем автоматическую загрузку чанка при монтировании или изменении времени
  useEffect(() => {
    if (!track) return;

    // Загрузка чанка по времени только при необходимости
    const handleTimeUpdate = (time: number) => {
      console.log('ChunkLoader timeupdate:', time, 'loadedTime:', playerManager.getLoadedTime());
      if (track && time + 10 >= playerManager.getLoadedTime() && !isChunkLoading) {
        loadChunk();
      }
    };

    playerManager.on('audio_timeupdate', handleTimeUpdate);
    return () => playerManager.off('audio_timeupdate', handleTimeUpdate);
  }, [loadChunk, track, isChunkLoading]);

  useEffect(() => {
    if (error) {
      console.error('Chunk loading error:', error);
      playerManager.emit('audio_error', error?.message);
    }
  }, [error]);

  return { isLoading, error, loadChunk }; // Возвращаем loadChunk для вызова в usePlayTrack
};
