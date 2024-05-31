'use client'

import MainLayout from "@/layouts/MainLayout";
import styles from '@/styles/tracks.module.css'
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useSearchByNameQuery } from "@/api/Track/TrackService";
import Loader from "@/components/Loader/Loader";
import TrackList from "@/components/Tracks/TrackList/TrackList";
import HeaderList from "@/components/HeaderList/HeaderList";
import useModal from "@/hooks/useModal";
import ModalContainer from "@/UI/ModalContainer/ModalContainer";
import { memo } from "react";
import IndexPage from "@/components/IndexPage/IndexPage";

const IndexTracks = ()=> {

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

    return (
        <IndexPage
            title='Список треков'
            placeholder=''
            routerPath=''
            data={searchTracks}
            error={error}
            isLoading={isLoadingSearch}
            renderItem={<TrackList/>}
        />
        
    )
}

export default memo(IndexTracks)