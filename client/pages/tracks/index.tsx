'use client'

import MainLayout from "@/layouts/MainLayout";
import styles from '../../styles/tracks.module.css'
import { useRouter } from "next/router";
import TrackList from "@/components/TrackList";
import {useSearchByNameQuery } from "@/services/TrackService";
import DropDownMenu from "@/components/DropDownMenu";
import Loader from "@/components/Loader";
import MainInput from "@/components/MainInput";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import {useState } from "react";
import { ITrack } from "@/types/track";

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
                    <button 
                        onClick={()=> router.push('/tracks/create')}
                        className={styles.btn}
                    >
                        Загрузить
                    </button>
                    
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