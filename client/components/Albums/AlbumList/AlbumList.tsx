import { IAlbum } from '@/types/track'
import AlbumItem from '../AlbumItem/AlbumItem'
import styles from './AlbumList.module.css'
import { FC, memo } from 'react';
import useActions from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import useScroll from '@/hooks/useScroll';
import ListWithScroll from '@/components/ListWithScroll/ListWithScroll';

interface AlbumListProps{
    albums: IAlbum[];
}

const AlbumList:FC<AlbumListProps> = memo(({albums}) => {

    const {setCountAlbums} = useActions()

    const { countAlbums, offsetAlbums} = useTypedSelector(state=> state.searchAlbumsReducer)
    const {selectedSort} = useTypedSelector(state => state.dropdownReducer)

    const [isFetching, setIsFetching] = useScroll(() => {
        if(isFetching || countAlbums < albums.length || offsetAlbums - countAlbums == 10) {
            setCountAlbums(countAlbums + 10)
        }
    })

    return (
        <ListWithScroll<IAlbum>
            items={albums}
            renderItem={(album: IAlbum) => <AlbumItem key={album.id} album={album}/>}
            selectedSort={selectedSort}
            setCountItems={setCountAlbums}
            countItems={countAlbums}
            offsetItems={offsetAlbums}
            styles={{container: styles.container}}
        />
    )
})

export default AlbumList