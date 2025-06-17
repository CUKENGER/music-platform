import { useCallback, useEffect } from 'react';
import { ITrack } from '../types/Track';
import audioManager from './AudioManager';
import usePlayerStore from './PlayerStore';
import useActiveTrackListStore from './ActiveTrackListStore';
import TrackSwitchManager from './TrackSwitchManager';

export const usePlayTrack = (track: ITrack, trackList: ITrack[]) => {
  const { setActiveTrack, activeTrack, setPlay, setPause, pause } = usePlayerStore();
  const setActiveTrackList = useActiveTrackListStore((state) => state.setActiveTrackList);
  const filename = track.audio;

  useEffect(() => {
    audioManager.setTrackSwitchCallback({
      onTrackEnded: () => {
        console.log('usePlayTrack: Срабатывание onTrackEnded');
        TrackSwitchManager.switchTrack(true, {
          activeTrack,
          activeTrackList: trackList,
          setActiveTrack,
          setPlay,
        });
      },
    });
    return () => {
      audioManager.setTrackSwitchCallback({ onTrackEnded: () => {} });
    };
  }, [activeTrack, trackList, setActiveTrack, setPlay]);

  const play = useCallback(async () => {
    const isSameTrack = activeTrack?.id === track.id;

    if (isSameTrack) {
      if (!pause) {
        audioManager.pause();
        setPause();
      } else {
        await audioManager.play();
        setPlay();
      }
    } else {
      audioManager.cleanup();
      setActiveTrack(track);
      setActiveTrackList(trackList);
      try {
        await audioManager.loadHlsSource(`/api/${filename}/master.m3u8`);
        setPlay();
      } catch (err) {
        console.error('usePlayTrack: Ошибка воспроизведения:', err);
        setPause();
      }
    }
  }, [
    filename,
    track,
    activeTrack,
    setActiveTrack,
    setPlay,
    setPause,
    pause,
    trackList,
    setActiveTrackList,
  ]);

  return { play, pause };
};
