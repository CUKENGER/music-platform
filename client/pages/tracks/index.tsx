'use client'

import MainLayout from "@/layouts/MainLayout";
import styles from '../../styles/tracks.module.css'
import { useRouter } from "next/router";
import TrackList from "@/components/TrackList";
import { useGetTracksQuery } from "@/services/TrackService";


const Index = ()=> {

    const router = useRouter()

    const {data, error, isLoading} = useGetTracksQuery({ count: 10, offset: 0 });

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        let message = 'Unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        return <div>Error: {message}</div>;
    }

    return (
        <MainLayout title_text="Список треков">
            <div className={styles.container}>
                <div className={styles.header__container}>
                    <button 
                    onClick={()=> router.push('/tracks/create')}
                    className={styles.btn}
                    >
                        Загрузить
                    </button>
                </div>
                {data && <TrackList tracks={data}/>}
                
                
            </div>
        </MainLayout>
    )
}

export default Index;