import styles from './PlayerDetailed.module.css'
import Image from 'next/image'
import {useTypedSelector} from "@/hooks/useTypedSelector";
import {baseUrl} from "@/services/baseUrl";
const PlayerDetailed = () => {

    const {activeTrack} = useTypedSelector(state => state.playerReducer)

    return (
        <div className={styles.container}>
            <div className={styles.cover_container}>
                <img
                    className={styles.cover}
                    src={baseUrl + activeTrack?.picture}
                    alt='cover icon'
                />
            </div>
            <div className={styles.right_container}>
                <div className={styles.navBar_container}>
                    <div className={styles.navBar_item}>Текст</div>
                </div>
                <div className={styles.text_container}>
                    <p className={styles.text}>{activeTrack?.text}</p>
                </div>
            </div>
        </div>
    );
};

export default PlayerDetailed;