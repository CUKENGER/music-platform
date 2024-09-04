import { useAddListenTrack, usePlayerStore } from "@/entities";
import { useEffect, useState } from "react";

export const usePlayer = () => {
  const {activeTrack} = usePlayerStore()

  const [hasListen, setHasListen] = useState(false);
  const [isOpenPlayer, setIsOpenPlayer] = useState(false)

  const {mutate: addListen} = useAddListenTrack()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (activeTrack && !hasListen) {
      timeoutId = setTimeout(() => {
        if (activeTrack.id) {
          addListen(activeTrack.id);
          console.log('add');
          setHasListen(true);
        }
      }, 30000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    activeTrack, 
    hasListen, 
    addListen
  ]);

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
    handleOpen,
    isOpenPlayer
  }
}