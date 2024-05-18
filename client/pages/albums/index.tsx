import Btn from '@/UI/Btn/Btn'
import DropDownMenu from '@/UI/DropdownMenu/DropDownMenu'
import MainInput from '@/UI/MainInput/MainInput'
import { useSearchByNameAlbumsQuery } from '@/api/AlbumService'
import AlbumList from '@/components/Albums/AlbumList/AlbumList'
import Loader from '@/components/Loader/Loader'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import MainLayout from '@/layouts/MainLayout'
import styles from '@/styles/Albums.module.css'
import { useRouter } from 'next/router'

export default function Albums() {

    const router = useRouter()
    const {countAlbums, offsetAlbums, searchAlbumsInput} = useTypedSelector(state => state.searchAlbumsReducer)

    const {data: searchAlbums, error, isLoading} = useSearchByNameAlbumsQuery({
        query: searchAlbumsInput,
        count: countAlbums,
        offset: offsetAlbums
    })

    if (isLoading) return <Loader/>;
    if (error) {
        console.log(`error in tracks: ${error}`);
    }

    return (
        <MainLayout title_text='Список альбомов'>
            <div className={styles.container}>
                <div className={styles.container_input_container}>
                    <div className={styles.input_container}>
                        <MainInput placeholder='Найти альбом'/>
                    </div>
                </div>
                <div className={styles.btn_container}>
                    <Btn onClick={()=> router.push('/albums/create')}>
                        Загрузить
                    </Btn>
                    <DropDownMenu/>
                </div>
                {searchAlbums &&
                searchAlbums.length > 0 
                ? (<AlbumList albums={searchAlbums}/>) 
                : (<div className={styles.not_found_container}>Ничего не найдено</div>)
                }
            </div>
        </MainLayout>
    )
}