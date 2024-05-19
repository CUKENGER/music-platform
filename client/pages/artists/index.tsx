import { memo } from "react"
import styles from '@/styles/Artists.module.css'
import MainLayout from "@/layouts/MainLayout"
import MainInput from "@/UI/MainInput/MainInput"
import Btn from "@/UI/Btn/Btn"
import { isAdmin } from "@/services/isAdmin"
import DropDownMenu from "@/UI/DropdownMenu/DropDownMenu"
import { useRouter } from "next/router"
import Loader from "@/components/Loader/Loader"
import { useTypedSelector } from "@/hooks/useTypedSelector"
import { useSearchByNameArtistsQuery } from "@/api/ArtistService"
import ArtistList from "@/components/Artists/ArtistList/ArtistList"

const IndexArtists = memo(() => {

    const router = useRouter()

    const {countArtists, offsetArtists,searchArtistsInput} = useTypedSelector(state => state.searchArtistsReducer)

    const {data: searchArtists, error, isLoading} = useSearchByNameArtistsQuery({
        query: searchArtistsInput,
        count: countArtists,
        offset: offsetArtists
    })

    if (isLoading) return <Loader/>;
    if (error) {
        console.log(`error in tracks: ${error}`);
    }

    return (
        <MainLayout title_text="Список артистов">
            <div className={styles.container}>
                <div className={styles.container_input_container}>
                    <div className={styles.input_container}>
                        <MainInput placeholder='Найти артиста'/>
                    </div>
                </div>
                <div className={styles.btn_container}>
                    {isAdmin && (
                        <Btn onClick={()=> router.push('/artists/create')}>
                            Загрузить
                        </Btn>
                    )}
                    <DropDownMenu/>
                </div>
                {searchArtists &&
                searchArtists.length > 0 
                ? (<ArtistList artists={searchArtists}/>) 
                : (<div className={styles.not_found_container}>Ничего не найдено</div>)
                }
            </div>
        </MainLayout>
    )
})

export default IndexArtists