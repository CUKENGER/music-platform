import { useCallback, useEffect, useState } from "react";
import { useTypedSelector } from "../useTypedSelector";
import { useRouter } from "next/router";
import { useAddListenMutation } from "@/api/Track/TrackService";
import useActions from "../useActions";
import audioManager from "@/services/AudioManager";
import { mixTracks } from "@/services/MixPlaylist";



export const usePlayer = () => {
  const { activeTrack, 
    pause, 
    currentTime, 
    isOpenPlayerDetailed, 
    activeTrackList, 
    defaultTrackList, 
    duration } = useTypedSelector(state => state.playerReducer);
    const { setOpenedTrack, 
      playerPlay, 
      playerPause, 
      setIsOpenPlayerDetailed, 
      setActiveTrackList } = useActions();
    const [isLike, setIsLike] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isMix, setIsMix] = useState(false);
    const [hasListen, setHasListen] = useState(false);
    const [addListenMutation] = useAddListenMutation();
    const router = useRouter();
    const audio = audioManager.audio;

    useEffect(() => {
        if (currentTime >= 30 && !hasListen && activeTrack) {
            if (activeTrack.id) {
                addListenMutation(activeTrack.id);
                setHasListen(true);
            }
        }
    }, [currentTime, hasListen, activeTrack, addListenMutation]);

    const handleTrackClick = useCallback(() => {
      if (activeTrack) {
        router.push('/tracks/' + activeTrack?.id);
        setOpenedTrack(activeTrack);
      }
    }, [router, activeTrack, setOpenedTrack]);

    const playBtn = useCallback(async () => {
        if (pause) {
            await audio?.play();
            playerPlay();
        } else {
            audio?.pause();
            playerPause();
        }
    }, [pause, audio, playerPlay, playerPause]);

    const handleOpenPlayer = useCallback(() => {
        setIsOpenPlayerDetailed(!isOpenPlayerDetailed);
    }, [isOpenPlayerDetailed, setIsOpenPlayerDetailed]);

    const handleLike = useCallback(() => {
        setLikes(prevLikes => isLike ? prevLikes - 1 : prevLikes + 1);
        setIsLike(!isLike);
    }, [isLike]);

    const handleMix = useCallback(() => {
        if (isMix) {
            setActiveTrackList(defaultTrackList);
        } else {
            setActiveTrackList(mixTracks(activeTrackList));
        }
        setIsMix(!isMix);
    }, [isMix, activeTrackList, defaultTrackList, setActiveTrackList]);

    return {
      activeTrack,
      pause,
      currentTime,
      duration,
      isLike,
      likes,
      isMix,
      isOpenPlayerDetailed,
      handleTrackClick,
      playBtn,
      handleOpenPlayer,
      handleLike,
      handleMix,
  }


}