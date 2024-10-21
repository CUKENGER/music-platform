import { useAddListenTrack, usePlayerStore } from "@/entities";
import { useEffect, useState } from "react";
import { useOpenPlayerStore } from "./openPlayerStore";

export const usePlayer = () => {
  const {activeTrack} = usePlayerStore()

  const [hasListen, setHasListen] = useState(false);
  const {isOpen: isOpenPlayer, setIsOpen: setIsOpenPlayer} = useOpenPlayerStore()

  const {mutate: addListen} = useAddListenTrack()

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (activeTrack && !hasListen) {
      timeoutId = setTimeout(() => {
        if (activeTrack.id) {
          addListen(activeTrack.id);
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