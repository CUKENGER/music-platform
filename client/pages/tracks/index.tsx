'use client'

import MainLayout from "@/layouts/MainLayout";
import styles from '@/styles/tracks.module.css'
import { useRouter } from "next/router";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useSearchByNameQuery } from "@/api/TrackService";
import MainInput from "@/UI/MainInput/MainInput";
import DropDownMenu from "@/UI/DropdownMenu/DropDownMenu";
import Loader from "@/components/Loader/Loader";
import TrackList from "@/components/Tracks/TrackList/TrackList";
import Btn from "@/UI/Btn/Btn";

const Index = ()=> {

    const router = useRouter()

    const {
        searchInput, 
        countTracks,
        offsetTracks
    } = useTypedSelector(state=> state.searchInputReducer)
    const {data: searchTracks, error, isLoading: isLoadingSearch} = useSearchByNameQuery({
        query: searchInput,
        count: countTracks,
        offset: offsetTracks
    })

    if (isLoadingSearch) return <Loader/>;
    if (error) {
        console.log(`error in tracks: ${error}`);
    }

    return (
        <MainLayout title_text="Список треков">
            <div className={styles.container}>
                <div className={styles.container_input_container}>
                    <div className={styles.input_container}>
                        <MainInput placeholder='Найти песню'/>
                    </div>
                </div>
                <div className={styles.header__container}>
                    <Btn 
                        onClick={()=> router.push('/tracks/create')}
                    >
                        Загрузить
                    </Btn>
                    
                    <DropDownMenu/>
                    
                </div>
                
                {searchTracks &&
                searchTracks &&
                searchTracks.length > 0 
                ? (<TrackList tracks={searchTracks}/>) 
                : (<div className={styles.not_found_container}>Ничего не найдено</div>)
                }
                
            </div>
        </MainLayout>
    )
}

export default Index;