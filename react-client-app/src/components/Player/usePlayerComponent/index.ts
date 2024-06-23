import { useCallback, useEffect, useState } from "react";
import { useAddLikeTrackMutation, useAddListenMutation, useDeleteLikeTrackMutation } from "@/api/Track/TrackService";
import audioManager from "@/services/AudioManager";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import useActions from "@/hooks/useActions";

export const usePlayerComponent = () => {
  const { activeTrack,
    pause,
    activeTrackList,
    currentTime,
    duration } = useTypedSelector(state => state.playerReducer);

  const {
    setPlay,
    setPause,
    setActiveTrackList } = useActions();

  const [isMix, setIsMix] = useState(false);
  const [hasListen, setHasListen] = useState(false);

  const [deleteLike] = useDeleteLikeTrackMutation()
  const [addLike] = useAddLikeTrackMutation()

  const [addListenMutation] = useAddListenMutation()
  const audio = audioManager.audio

  useEffect(() => {
    if (currentTime >= 30 && !hasListen && activeTrack) {
      if (activeTrack.id) {
        addListenMutation(activeTrack.id);
        setHasListen(true);
      }
    }
  }, [currentTime, hasListen, activeTrack, addListenMutation]);

  // const handleTrackClick = useCallback(() => {
  //   if (activeTrack) {
  //     router.push('/tracks/' + activeTrack?.id);
  //     // setOpenedTrack(activeTrack);
  //   }
  // }, [router, activeTrack, setOpenedTrack]);

  const playBtn = useCallback(async () => {
    // audio?.load()
    if (pause) {
      await audio?.play()
      setPlay();
    } else {
      await audio?.pause();
      setPause();
    }
  }, [pause]);

  // const handleOpenPlayer = useCallback(() => {
  //   setIsOpenPlayerDetailed(!isOpenPlayerDetailed);
  // }, [isOpenPlayerDetailed, setIsOpenPlayerDetailed]);

  // const handleMix = useCallback(() => {
  //   if (isMix) {
  //     setActiveTrackList(defaultTrackList);
  //   } else {
  //     setActiveTrackList(mixTracks(activeTrackList));
  //   }
  //   setIsMix(!isMix);
  // }, [isMix, activeTrackList, defaultTrackList, setActiveTrackList]);

  return {
    activeTrack,
    pause,
    currentTime,
    duration,
    isMix,
    playBtn,
    addLike,
    deleteLike
  }
}
