import { memo } from "react";
import styles from './NavText.module.scss'
import { useTypedSelector } from "@/hooks/useTypedSelector";

const NavText = () => {

  const {activeTrack} = useTypedSelector(state => state.playerReducer)

  return (
    <div className={styles.container}>
      <p className={styles.text}>
        {activeTrack?.text}
      </p>
    </div>
  );
};

export default memo(NavText);