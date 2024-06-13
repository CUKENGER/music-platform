import MainLayout from "@/layouts/MainLayout"
import { memo, useCallback, useEffect } from "react"
import styles from '@/styles/ArtistPage.module.css'
import { useTypedSelector } from "@/hooks/useTypedSelector"
import { baseUrl } from "@/services/baseUrl"
import TrackList from "@/components/Artists/ArtistPage/TrackList/TrackList"
import Btn from "@/UI/Btn/Btn"
import { useRouter } from "next/router"
import ArtistAlbumList from "@/components/Artists/ArtistPage/ArtistAlbumList/ArtistAlbumList"

const ArtistPage = () => {
    const router = useRouter()

    const {openedArtist} = useTypedSelector(state => state.searchArtistsReducer)

    const handleBack = useCallback(()=>{
        router.push('/artists')
    }, [router])

    useEffect(()=> {
        if (!openedArtist) {
            router.push('/artists')
        }
    }, [router,
        openedArtist
    ])

    const handleChangeArtist = () => {
        router.push('/artists/change')
    }

    return (
        <MainLayout title_text="dasfdsaf">
            <div className={styles.container}>
                <div className={styles.btn_container}>
                    <Btn onClick={handleBack}>Назад</Btn>
                </div>
                <div className={styles.main_cover_container}>
                    <div className={styles.cover_container}>
                        <img className={styles.cover} src={baseUrl + openedArtist?.picture} alt="cover icon" />
                    </div>
                </div>
                <div className={styles.info_container}>
                    <h3 className={styles.name}>{openedArtist?.name}</h3>
                    <p>{openedArtist?.description}</p>
                </div>
                <div>
                    <Btn onClick={handleChangeArtist}>
                        Изменить
                    </Btn>
                </div>
                <div className={styles.btns_container}></div>
                {openedArtist?.tracks && (
                    <TrackList tracks={openedArtist?.tracks}/>
                )}
                {openedArtist?.albums && (
                    <ArtistAlbumList albums={openedArtist?.albums}/>
                )}
                
                <div className={styles.albums}></div>
            </div>
        </MainLayout>
    )
}

ArtistPage.displayName = 'ArtistPage';

export default memo(ArtistPage);
