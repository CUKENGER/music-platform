import ModalContainer from '@/UI/ModalContainer/ModalContainer'
import { useSearchByNameAlbumsQuery } from '@/api/Album/AlbumService'
import AlbumList from '@/components/Albums/AlbumList/AlbumList'
import HeaderList from '@/components/HeaderList/HeaderList'
import Loader from '@/components/Loader/Loader'
import useModal from '@/hooks/useModal'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import MainLayout from '@/layouts/MainLayout'
import styles from '@/styles/Albums.module.css'
import { memo } from 'react'

const IndexAlbums = () =>{

    const {countAlbums, offsetAlbums, searchAlbumsInput} = useTypedSelector(state => state.searchAlbumsReducer)
    const {showModal, modal, hideModal} = useModal()

    const {data: searchAlbums, error, isLoading} = useSearchByNameAlbumsQuery({
        query: searchAlbumsInput,
        count: countAlbums,
        offset: offsetAlbums
    })

    if (error) {
        showModal(`error in artists: ${error}`);
    }

    return (
        <MainLayout title_text='Список альбомов'>
            <div className={styles.container}>
                
                <HeaderList
                    placeholder="Найти альбом"
                    routerPath="/albums/create"
                />
                {searchAlbums &&
                searchAlbums.length > 0 
                ? (<AlbumList albums={searchAlbums}/>) 
                : (<div className={styles.not_found_container}>Ничего не найдено</div>)
                }
                {isLoading && (
                    <Loader/>
                )}
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

export default memo(IndexAlbums) 