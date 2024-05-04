import styles from '@/styles/PlayerMobile.module.css';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import useActions from '@/hooks/useActions';
import {useEffect, useState } from 'react';
import { useAddListenMutation } from '@/services/TrackService';
import { useRouter } from 'next/router';
import PlaybackBtn from './PlaybackBtn';
import SwitchTracksBtn from './SwitchTracksBtn';
import TrackProgress from './TrackProgress';

const PlayerMobile = () => {

    const router = useRouter()

    const [hasListen, setHasListen] = useState(false);

    const {activeTrack, currentTime} = useTypedSelector(state => state.playerReducer)
    const {setOpenedTrack} = useActions()

    const [addListenMutation] = useAddListenMutation()

    useEffect(() => {
        if (currentTime >= 30 && !hasListen && activeTrack) {
            addListenMutation(activeTrack?.id)
            setHasListen(true)
        }
    }, [currentTime, hasListen, activeTrack])

    if (!activeTrack) {
        return null
    }

    const handleTrackClick = () => {
        router.push('/tracks/' + activeTrack?.id)
        setOpenedTrack(activeTrack)
    }

    return (
        <div className={styles.main_container}>
            <TrackProgress isVolume={false}/>
            <div className={styles.bottom_container}>

                <div className={styles.name_container}>
                    <p className={styles.name} onClick={handleTrackClick}>
                        {activeTrack?.name}
                    </p>
                    <p className={styles.artist}>
                        {activeTrack?.artist}
                    </p>
                </div>
                <div className={styles.playerBtns_container}>
                    <SwitchTracksBtn isNextBtn={false}/>
                    <PlaybackBtn/>
                    <SwitchTracksBtn/>
                </div>
                <TrackProgress/>
            </div>
        </div>
    )
}

export default PlayerMobile