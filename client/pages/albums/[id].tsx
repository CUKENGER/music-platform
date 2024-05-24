import { useTypedSelector } from "@/hooks/useTypedSelector"
import MainLayout from "@/layouts/MainLayout"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"
import styles from '@/styles/AlbumPage.module.css'
import plays_icon from '@/assets/plays.png'
import Image from 'next/image'
import { baseUrl } from "@/services/baseUrl"
import AlbumTrackList from "@/components/Albums/AlbumPage/AlbumTrackList/AlbumTrackList";
import Btn from "@/UI/Btn/Btn"
import { useDeleteAlbumMutation } from "@/api/AlbumService"
import { isAdmin } from "@/services/isAdmin"

const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

const AlbumPage = () => {
    const router = useRouter()
    const {openedAlbum} = useTypedSelector(state => state.searchAlbumsReducer)

    useEffect(()=>{
        if(!openedAlbum){
            router.push('/albums')
        }
    })

    const formatDate = useCallback((dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    },[] )

    const [deleteAlbumMutation] = useDeleteAlbumMutation()

    const handleDelete = async () => {
        if(openedAlbum?.id) {
            try{
                await deleteAlbumMutation(openedAlbum?.id)
                    .then((response) => {
                        console.log('response', response)
                    })
                    .catch((error) => {
                        console.log('error', error);
                    })
                    
                
                await router.push('/albums')
            } catch(e){
                console.log(`Альбом ${openedAlbum?.name} ${openedAlbum?.id} not found`)
            }
        }
    }

    const handleBackPage = () => {
        router.push('/albums')
    }

    return (
        <MainLayout title_text={openedAlbum?.name}>
            <div className={styles.container}>
                <div>
                    <button className={styles.btn} onClick={handleBackPage}>
                        Назад
                    </button>
                </div>
                <div className={styles.header_container}>

                    <div className={styles.header_left_container}>
                        <div className={styles.cover_container}>
                            <img
                                className={styles.cover}
                                src={baseUrl + openedAlbum?.picture} 
                                alt="cover icon"
                            />
                        </div>
                        <div className={styles.main_info_container}>
                            <p>{openedAlbum?.artist}</p>
                            <p className={styles.album_name}>{openedAlbum?.name}</p>
                            <div className={styles.plays_container}>
                                25 
                                <Image 
                                    className={styles.plays_icon}
                                    src={plays_icon} 
                                    alt="plays icon"
                                />
                                </div>
                            <p>54:33</p>
                            {openedAlbum?.releaseDate && (
                                <p>{formatDate(openedAlbum?.releaseDate)}</p>
                            )}
                        </div>
                    
                    </div>
                    <div className={styles.album_desc_container}>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis veritatis voluptatibus corporis tenetur odit qui unde debitis! Dignissimos officia placeat nesciunt consequuntur amet sit veritatis?</p>
                        
                    </div>
                </div>
                <div className={styles.btn_title_container}>
                    {isAdmin && (    
                                <div className={styles.btn_container}>
                                    <Btn onClick={handleDelete}>
                                        Удалить
                                    </Btn>
                                </div>
                            )}
                    <p className={styles.tracks_container_title}>16 треков</p>
                </div>
                <div className={styles.tracks_title_info_container}>
                    <p className={styles.tracks_info_name}>Название</p>
                    <p className={styles.tracks_info_plays}>Прослушивания</p>
                    <p className={styles.tracks_info_duration}>Длительность</p>
                </div>
                {openedAlbum?.tracks && (
                    <AlbumTrackList tracks={openedAlbum?.tracks}/>
                )}
            </div>
        </MainLayout>
    )
}

export default AlbumPage