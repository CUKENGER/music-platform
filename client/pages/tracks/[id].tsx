'use client'

import { useTypedSelector } from "@/hooks/useTypedSelector";
import MainLayout from "@/layouts/MainLayout";
import styles from '@/styles/TrackPage.module.css';
import { useRouter } from "next/router";
import { useState } from "react";
import useWindowWidth from "@/hooks/useWindowWidth";
import TrackInfo from "@/components/Tracks/TrackPage/TrackInfo/TrackInfo";
import Btn from "@/UI/Btn/Btn";
import TrackLyrics from "@/components/Tracks/TrackPage/TrackLyrics/TrackLyrics";
import TrackComments from "@/components/Tracks/TrackPage/TrackComments/TrackComments";
import TrackCommentsMobile from "@/components/Tracks/TrackPage/TrackCommentsMobile/TrackCommentsMobile";

const TrackPage = () => {

    const {openedTrack} = useTypedSelector(state => state.playerReducer)
    const windowWidth = useWindowWidth()
    const router = useRouter()
    const [isModal, setIsModal] = useState(false)

    const handleOpenModal = () =>{
        setIsModal(!isModal)
    }

    return (
        <MainLayout title_text={openedTrack?.name}>
            <div className={styles.container}>
                <div className={styles.main_info_container}>

                    <Btn onClick={() => router.push('/tracks')}>
                        Назад
                    </Btn>
                    {openedTrack && (
                        <TrackInfo
                            openedTrack={openedTrack}
                        />
                    )}
                    
                    <div className={styles.comments_container}>
                        {windowWidth < 500 
                        ? (
                            <div className={styles.comments_btn_container}>
                                <Btn onClick={handleOpenModal}>
                                    Комментарии
                                </Btn>
                            </div>
                        )
                        : (<TrackComments openedTrack={openedTrack}/>)
                        }
                    </div>
                </div>
                {openedTrack && (
                    <TrackLyrics openedTrack={openedTrack}/>
                )}

                {isModal ? (
                    <TrackCommentsMobile 
                        openedTrack={openedTrack}
                        handleOpenModal={handleOpenModal}
                    />
                ) : ('')
                }
            </div>
        </MainLayout>
    )
}

export default TrackPage;