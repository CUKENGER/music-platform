import { useEffect, useState } from "react";
import { useOpenPlayerStore } from "./openPlayerStore";
import { useAddListenTrack, usePlayerStore } from "@/entities/track";

export const usePlayer = () => {
  const activeTrack = usePlayerStore((state) => state.activeTrack);
  const [hasListen, setHasListen] = useState(false);
  const { isOpen: isOpenPlayer, setIsOpen: setIsOpenPlayer } = useOpenPlayerStore();

  const { mutate: addListen } = useAddListenTrack();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (activeTrack?.id && !hasListen) {
      timeoutId = setTimeout(() => {
        addListen(activeTrack.id);
        setHasListen(true);
      }, 30000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeTrack?.id, hasListen, addListen]);

  useEffect(() => {
    if (activeTrack?.id) {
      setHasListen(false);
    }
  }, [activeTrack?.id]);

  const handleOpen = () => {
    setIsOpenPlayer(!isOpenPlayer);
  };

  return {
    activeTrack,
    handleOpen,
    isOpenPlayer,
  };
};
