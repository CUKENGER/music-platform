import { memo } from "react";
import styles from './PlayerDetailed.module.scss'
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { apiUrl } from "@/api/apiUrl";
import NavContainer from "./NavContainer";

const PlayerDetailed = () => {

  const {activeTrack} = useTypedSelector(state => state.playerReducer)

  return (
    <div className={styles.player_detailed}>
      <div className={styles.cover_container}>
        <img 
          className={styles.cover}
          src={apiUrl +  activeTrack?.picture} 
          alt="cover image"
        />
      </div>
      <NavContainer/>
    </div>
  );
};

export default memo(PlayerDetailed);