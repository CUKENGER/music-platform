import { IAlbum } from '@/types/track'
import AlbumItem from '../AlbumItem/AlbumItem'
import styles from './AlbumList.module.css'
import { FC, useEffect, useRef, useState } from 'react';
import useActions from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import useScroll from '@/hooks/useScroll';


interface AlbumListProps{
    albums: IAlbum[];
}

const AlbumList:FC<AlbumListProps> = ({albums}) => {

    const [sortedAlbums, setSortedAlbums] = useState<IAlbum[] | null>(null)

    const {setCountAlbums} = useActions()

    const { countAlbums, offsetAlbums} = useTypedSelector(state=> state.searchAlbumsReducer)
    const {selectedSort} = useTypedSelector(state => state.dropdownReducer)

    const parentRef = useRef<HTMLDivElement>(null)
    const [isFetching, setIsFetching] = useScroll(() => {
        if(isFetching || countAlbums < albums.length || offsetAlbums - countAlbums == 10) {
            setCountAlbums(countAlbums + 10)
        }
    })

    const sortAlbums = (albums: IAlbum[], selectedSort: string) => {
        const sorted = [...albums].sort((a, b) => {
            switch (selectedSort) {
                case 'Все':
                    if (a.id && b.id) {
                        return a.id - b.id;
                    }
                case 'По алфавиту':
                    const nameA = a.name.toLowerCase();
                    const nameB = b.name.toLowerCase();
                    return nameA.localeCompare(nameB);
                case 'Популярные':
                    if (b.listens && a.listens) {
                        return b.listens - a.listens;
                    }
                default:
                    return 0;
            }
        });
        setSortedAlbums(sorted);
    };

    useEffect(() => {
        if (albums) {
            sortAlbums(albums, selectedSort);
        }
    }, [selectedSort, albums]);

    return (
        <div ref={parentRef} className={styles.container}>
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