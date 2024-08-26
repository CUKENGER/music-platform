import { apiUrl } from "@/shared/config/apiUrl";
import { useTypedSelector } from "@/shared/hooks/useTypedSelector";
import { memo } from "react";
import styles from './PlayerDetailed.module.scss';
import NavContainer from "../NavContainer/NavContainer";

const PlayerDetailed = () => {

  const {activeTrack} = useTypedSelector(state => state.playerReducer)

  return (
    <div className={styles.player_detailed}>
      <div className={styles.cover_container}>
        <img 
          className={styles.cover}
          src={apiUrl +  activeTrack?.picture} 
          alt="cover"
        />
      </div>
      <NavContainer/>
    </div>
  );
};

export default memo(PlayerDetailed);