import { useEffect, useState } from "react";
import { useAddLikeTrackMutation, useAddListenMutation, useDeleteLikeTrackMutation } from "@/api/Track/TrackService";
import { useTypedSelector } from "@/hooks/useTypedSelector";

export const usePlayerComponent = () => {
  const activeTrack = useTypedSelector(state => state.playerReducer.activeTrack);

  const [hasListen, setHasListen] = useState(false);
  const [isOpenPlayer, setIsOpenPlayer] = useState(false)

  const [deleteLike] = useDeleteLikeTrackMutation()
  const [addLike] = useAddLikeTrackMutation()

  const [addListen] = useAddListenMutation()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (activeTrack && !hasListen) {
      timeoutId = setTimeout(() => {
        if (activeTrack.id) {
          addListen(activeTrack.id);
          console.log('add');
          setHasListen(true);
        }
      }, 30000); // 30000 миллисекунд = 30 секунд
    }

    // Очистка таймера, если компонент размонтируется или трек меняется
    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeTrack, hasListen, addListen]);

  // Сбрасываем hasListen при смене трека
  useEffect(() => {
    if (activeTrack) {
      setHasListen(false);
    }
  }, [activeTrack]);

  const handleOpen = () => {
    setIsOpenPlayer(!isOpenPlayer)
  }

  return {
    activeTrack,
    addLike,
    deleteLike,
    handleOpen,
    isOpenPlayer
  }
}
