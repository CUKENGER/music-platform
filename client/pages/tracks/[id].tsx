'use client'

import { useTypedSelector } from "@/hooks/useTypedSelector";
import MainLayout from "@/layouts/MainLayout";
import { baseUrl } from "@/services/baseUrl";
import styles from '@/styles/TrackPage.module.css';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useActions from "@/hooks/useActions";
import Comments from "@/components/Tracks/TrackPage/Comments/Comments";
import CommentsMobile from "@/components/Tracks/TrackPage/CommentsMobile/CommentsMobile";
import { windowActions } from "@/store/reducers/windowSlice";

const TrackPage = () => {

    const {openedTrack} = useTypedSelector(state => state.playerReducer)
    const {windowWidth} = useTypedSelector(state => state.windowReducer)
    const {setWindowWidth} = useActions()

    const router = useRouter()
    const [isModal, setIsModal] = useState(false)

    useEffect(()=>{
        const handleResize = () =>{
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [windowWidth, setWindowWidth])

    const handleOpenModal = () =>{
        setIsModal(!isModal)
    }

    return (
        <MainLayout title_text={openedTrack?.name}>
            <div className={styles.container}>
                <div className={styles.main_info_container}>

                    <button 
                        className={styles.btn}
                        onClick={() => router.push('/tracks')}
                    >
                        Назад
                    </button>

                    <div className={styles.main_info_wrapper}>
                        <div className={styles.cover_container}>

                            <img
                                src={baseUrl + openedTrack?.picture} 
                                className={styles.cover}
                                alt="cover icon"
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
                    <div className={styles.comments_container}>
                        {windowWidth < 500 
                        ? (
                            <div className={styles.comments_btn_container}>
                                <button 
                                    onClick={handleOpenModal}
                                    className={styles.comments_btn}
                                >
                                    Комментарии
                                </button>
                                
                            </div>
                        )
                        : (
                            <Comments openedTrack={openedTrack}/>
                        )
                        }
                        
                        
                    </div>

                </div>

                <div className={styles.lyrics_container}>
                    <div className={styles.title_lyrics_container + ' ' + styles.title_lyrics_container_mobile}>
                        <p className={styles.title_lyrics}>
                            Текст песни
                        </p>
                        
                    </div>
                    
                    {openedTrack?.text
                    ? (
                        <p className={styles.lyrics + ' ' + styles.lyrics_hide}>{openedTrack.text}</p>
                        // openedTrack.text.split('\n').map((line, index) => (
                        //     <p className={styles.lyrics} key={index}>{line}<br/></p>
                        // ))
                    ) : ('')
                    }
                    

                </div>

                {isModal 
                ? (
                    <CommentsMobile 
                        openedTrack={openedTrack}
                        handleOpenModal={handleOpenModal}
                    />
                )
                : ('')
                }
            </div>
        </MainLayout>
    )
}

export default TrackPage;