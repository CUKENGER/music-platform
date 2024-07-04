import { memo } from "react";
import styles from './NavText.module.scss'
import { useTypedSelector } from "@/hooks/useTypedSelector";

const NavText = () => {

  const {activeTrack} = useTypedSelector(state => state.playerReducer)

  return (
    <div className={styles.container}>
      {activeTrack?.text.split('\n').map((line, index) => (
        <p key={index} className={styles.line}>
          {line}
        </p>
      ))}
    </div>
  );
};

export default memo(NavText);