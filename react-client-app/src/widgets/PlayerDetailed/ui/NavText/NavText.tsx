import { memo } from "react";
import styles from './NavText.module.scss'
import { useTypedSelector } from "@/shared/hooks/useTypedSelector";

const NavText = () => {

  const {activeTrack} = useTypedSelector(state => state.playerReducer)

  const lines = activeTrack?.text.split('\n')

  return (
    <div className={styles.container}>
      {lines && lines.map((line, index) => (
        <p key={index} className={styles.line}>
          {line}
        </p>
      ))}
    </div>
  );
};

export default memo(NavText);