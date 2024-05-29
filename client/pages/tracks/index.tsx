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

const Index = ()=> {

    const {showModal, modal, hideModal} = useModal()

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
        showModal('Произошла ошибка при загрузке треков')
    }

    return (
        <MainLayout title_text="Список треков">
            <div className={styles.container}>
                <HeaderList
                    placeholder="Найти песню"
                    routerPath="/tracks/create"
                />
                
                {searchTracks &&
                searchTracks.length > 0 
                ? (<TrackList tracks={searchTracks}/>) 
                : (<div className={styles.not_found_container}>Ничего не найдено</div>)
                }
                
            </div>
            {modal.isOpen && (
            <ModalContainer
                hideModal={hideModal}
                text={modal.message}
                onClick={modal.onClick}
            />
        )}
        </MainLayout>
        
    )
}

export default Index;