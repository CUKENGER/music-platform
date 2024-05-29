import { IAlbum } from '@/types/track'
import AlbumItem from '../AlbumItem/AlbumItem'
import styles from './AlbumList.module.css'
import { FC, useEffect, useRef, useState } from 'react';
import useActions from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import useScroll from '@/hooks/useScroll';
import { sortList } from '@/services/sortList';

interface AlbumListProps{
    albums: IAlbum[];
}

const AlbumList:FC<AlbumListProps> = ({albums}) => {

    const [sortedAlbums, setSortedAlbums] = useState<IAlbum[] | null>(null)

    const {setCountAlbums} = useActions()

    const { countAlbums, offsetAlbums} = useTypedSelector(state=> state.searchAlbumsReducer)
    const {selectedSort} = useTypedSelector(state => state.dropdownReducer)

    const [isFetching, setIsFetching] = useScroll(() => {
        if(isFetching || countAlbums < albums.length || offsetAlbums - countAlbums == 10) {
            setCountAlbums(countAlbums + 10)
        }
    })

    useEffect(() => {
        if (albums) {
            sortList(albums, selectedSort, setSortedAlbums)
        }
    }, [selectedSort, albums]);

    return (
        <div className={styles.container}>
            {sortedAlbums && sortedAlbums.map((album) => (
                <AlbumItem
                    key={album.id}
                    album={album}
                />
            ))}
        </div>
    )
}

export default AlbumList