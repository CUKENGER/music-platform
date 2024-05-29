import { FC, ComponentType, useEffect, memo } from "react";
import useActions from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import audioManager from "@/services/AudioManager";
import { baseUrl } from "@/services/baseUrl";
import { ITrack } from "@/types/track";

interface WithAudioPlayerProps {
  trackList: ITrack[];
  track: ITrack
}

const withAudioPlayer = (Component: ComponentType<any>): FC<WithAudioPlayerProps> => {
  return memo(({ trackList, track,  ...props }) => {
    const audio = audioManager.audio;
    const { volume, activeTrack } = useTypedSelector(state => state.playerReducer);
    const { playerSetDuration, playerSetCurrentTime, playerSetActiveTrack, playerPlay } = useActions();

    const setAudio = () => {
      if (activeTrack && audio) {
        if (audio.src !== baseUrl + activeTrack.audio) {
          audio.src = baseUrl + activeTrack.audio;
          audio.onloadedmetadata = () => {
            playerSetDuration(Math.ceil(audio.duration));
          };
          audio.onended = () => {
            handleNextTrack();
          };
          audio.oncanplay = () => {
            audio.play();
            playerPlay();
          };
        }
        audio.volume = volume / 100;
        audio.ontimeupdate = () => {
          playerSetCurrentTime(Math.ceil(audio.currentTime));
        };
      }
    };

    const handleNextTrack = () => {
      let nextTrackIndex = trackList.findIndex(t => t.id === activeTrack?.id) + 1;
      if (nextTrackIndex >= trackList.length) {
        nextTrackIndex = 0;
      }
      const nextTrack = trackList[nextTrackIndex];
      playerSetActiveTrack(nextTrack);
    };

    useEffect(() => {
      setAudio();
    }, [activeTrack, volume, trackList]);

    return <Component setAudio={setAudio} track={track} trackList={trackList} {...props} />;
  });
};

export default withAudioPlayer;
