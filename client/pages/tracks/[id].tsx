'use client'

import Comments from "@/components/Comments";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import MainLayout from "@/layouts/MainLayout";
import { baseUrl } from "@/services/baseUrl";
import styles from '@/styles/TrackPage.module.css';
import Image from 'next/image'


const TrackPage = () => {

    const {openedTrack} = useTypedSelector(state => state.playerReducer)

    return (
        <MainLayout title_text={openedTrack?.name}>
            <div className={styles.container}>
                <div className={styles.main_info_container}>

                    <div className={styles.main_info_wrapper}>
                        <div className={styles.cover_container}>

                            <img
                            src={baseUrl + openedTrack?.picture} 
                            className={styles.cover}
                            />
                        </div>

                        <div className={styles.info}>
                            <div className={styles.info_item_container}>
                                <p className={styles.category}>Исполнитель</p>
                                <p className={styles.artist}>{openedTrack?.artist}</p>
                            </div>
                            <div className={styles.info_item_container}>
                                <p className={styles.category}>Название</p>
                                <p className={styles.artist}>{openedTrack?.name}</p>
                            </div>
                            <div className={styles.info_item_container}>
                                <p className={styles.category}>Прослушиваний</p>
                                <p className={styles.artist}>{openedTrack?.listens}</p>
                            </div>
                        </div>
                    </div>

                    <Comments openedTrack={openedTrack}/>

                </div>

                <div className={styles.lyrics_container}>

                    <p className={styles.title_lyrics}>
                        Текст песни
                    </p>
                    {openedTrack?.text
                    ? openedTrack.text.split('\n').map((line, index) => (
                        <p className={styles.lyrics} key={index}>{line}</p>
                    ))
                    : (
                        <p className={styles.lyrics_old}>
                        Я ебался лишь единожды<br/>
                        Зачем где как что вы<br/>
                        Я помню день и я отважный<br/>
                        Будто переколень парадень<br/>
                        <br/>
                        А ты все ждешь и ждешь<br/>
                        Когда приду я голый в школу<br/>
                        Но я не приду я не хочу<br/>
                        <br/>
                        Я ебался лишь единожды<br/>
                        Зачем где как что вы<br/>
                        Я помню день и я отважный<br/>
                        Будто переколень парадень<br/>
                        <br/>
                        А ты все ждешь и ждешь<br/>
                        Когда приду я голый в школу<br/>
                        Но я не приду я не хочу<br/>
                    </p>
                    )
                    }
                    

                </div>
            </div>
        </MainLayout>
    )
}

export default TrackPage;