import { ChangeEvent, CSSProperties, useCallback, useEffect, useMemo, useState } from "react";
import useTrackTimeStore from "./TrackTimeStore";
import usePlayerStore from "./PlayerStore";
import useActiveTrackListStore from "./ActiveTrackListStore";
import useAudioChunkStore from "./AudioChunkStore";
import { audioManager, convertDurationToSeconds } from "@/shared/model";

export const useTrackProgress = () => {
  const chunkSize = 1000000;
  const [x, setX] = useState(0);
  const [hoverTime, setHoverTime] = useState("");

  const { currentTime, setCurrentTime } = useTrackTimeStore();
  const { start, loadedTime, setEnd, setStart, end, fileSize, setLoadedTime, isChunkExist, chunkDuration } = useAudioChunkStore()
  const activeTrack = usePlayerStore((state) => state.activeTrack);
  const setActiveTrack = usePlayerStore((state) => state.setActiveTrack);
  const setPlay = usePlayerStore((state) => state.setPlay);
  const activeTrackList = useActiveTrackListStore(state => state.activeTrackList)

  const duration = convertDurationToSeconds(activeTrack?.duration ?? "");

  const changeCurrentTime = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (audioManager.isAudioExist()) {
        const newValue = Number(e.target.value);
        audioManager.seekTo(newValue);
        setCurrentTime(newValue);

        if (newValue > loadedTime) {
          setLoadedTime(newValue);
        }
      }
    }, [setCurrentTime, loadedTime, setLoadedTime]);

  const handleTimeUpdate = useCallback(() => {
    const time = audioManager.getCurrentTime();
    if (time && Math.floor(time) !== currentTime) {
      setCurrentTime(Math.floor(time));
    }
  }, [setCurrentTime, currentTime]);

  useEffect(() => {
    const audio = audioManager.getAudio();

    if (audio && activeTrack) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
    }
    return () => audio?.removeEventListener("timeupdate", handleTimeUpdate);
  }, [activeTrack, handleTimeUpdate]);

  useEffect(() => {
    if (activeTrack && isChunkExist && loadedTime !== 0 && currentTime + 5 > loadedTime) {
      const newStart = end + 1;
      let newEnd = newStart + chunkSize - 1;
      setLoadedTime(loadedTime + chunkDuration)

      if (newEnd >= fileSize) {
        newEnd = fileSize - 1;
      }
      setEnd(newEnd);
      setStart(newStart);
    }
  }, [loadedTime, activeTrack, currentTime, end, start, fileSize, isChunkExist, setLoadedTime]);

  useEffect(() => {
    if (activeTrack && activeTrackList) {
      const totalDuration = convertDurationToSeconds(activeTrack?.duration ?? "0:00");
      if (currentTime + 1 >= totalDuration) {
        const currentTrackIndex = activeTrackList.findIndex(
          (t) => t.id === activeTrack.id
        );
        const nextTrackIndex = (currentTrackIndex + 1) % activeTrackList.length;
        const nextTrack = activeTrackList[nextTrackIndex];
        audioManager.cleanup();
        audioManager.seekTo(0);
        setCurrentTime(0)
        setStart(0);
        setEnd(chunkSize - 1);
        setLoadedTime(0);
        setActiveTrack(nextTrack);
        setPlay();
      }
    }
  }, [currentTime, activeTrack, activeTrackList, setCurrentTime, setLoadedTime, setActiveTrack]);

  useEffect(() => {
    if (activeTrack) {
      setLoadedTime(0)
    }
  }, [activeTrack, setLoadedTime]);

  const hoverTimeStyle: CSSProperties = {
    left: `${x - 13}px`,
  };

  const inputDurationStyle = useMemo(() => {
    return {
      "--value": `${(currentTime / Number(duration)) * 100}%`,
    } as CSSProperties;
  }, [currentTime, duration]);

  const handleMouseOver = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const offsetX = e.nativeEvent.offsetX;
      setX(offsetX);
      const maxValue = parseInt(target.max, 10);
      const value = (offsetX / target.offsetWidth) * maxValue;
      const time =
        Math.floor(value / 60) +
        ":" +
        (value % 60 < 10 ? "0" : "") +
        Math.floor(value % 60);
      setHoverTime(time);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHoverTime("");
  }, [setHoverTime]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const offsetX = e.nativeEvent.offsetX;
      setX(offsetX);
      const maxValue = parseInt(target.max, 10);
      const value = (offsetX / target.offsetWidth) * maxValue;
      const time =
        Math.floor(value / 60) +
        ":" +
        (value % 60 < 10 ? "0" : "") +
        Math.floor(value % 60);
      setHoverTime(time);
    },
    []
  );

  return {
    hoverTime,
    handleMouseLeave,
    handleMouseOver,
    handleMouseMove,
    duration,
    currentTime,
    changeCurrentTime,
    inputDurationStyle,
    hoverTimeStyle,
    loadedTime
  };
};
