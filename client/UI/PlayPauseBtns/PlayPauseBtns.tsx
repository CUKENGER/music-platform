import styles from "./PlayPauseBtns.module.css";
import {ITrack} from "@/types/track";
import {FC} from "react";
import {useTypedSelector} from "@/hooks/useTypedSelector";

interface PlayPauseBtnsProps{
    onClick?: () => void;
    pause?: boolean;
    track?: ITrack;
}
const PlayPauseBtns:FC<PlayPauseBtnsProps> = ({onClick, pause, track}) => {

    const {activeTrack} = useTypedSelector(state => state.playerReducer)

    return (
        <>
            {track
                ? (
                    <div className={styles.circle} onClick={onClick}>
                        <div
                            className={styles.shape + ' ' + (!pause && activeTrack?.name == track.name ? styles.stop : styles.play)}>
                        </div>
                    </div>
                )
                : (
                    <div className={styles.circle} onClick={onClick}>
                        <div className={styles.shape + ' ' + (!pause ? styles.stop : styles.play)}>
                        </div>
                    </div>
                )
            }
        </>

    );
};

export default PlayPauseBtns;