import {IArtist } from '@/types/track'
import styles from './ArtistList.module.css'
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import useActions from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import useScroll from '@/hooks/useScroll';
import ArtistItem from '../ArtistItem/ArtistItem';
import { searchArtistsActions } from '@/store/reducers/searchArtistsSlice';

interface ArtistListProps{
    artists: IArtist[];
}

const ArtistList:FC<ArtistListProps> = ({artists}) => {

    const [sortedArtists, setSortedArtists] = useState<IArtist[] | null>(null)

    const {setCountArtists} = useActions()

    const { countArtists, offsetArtists} = useTypedSelector(state=> state.searchArtistsReducer)
    const {selectedSort} = useTypedSelector(state => state.dropdownReducer)

    const parentRef = useRef<HTMLDivElement>(null)
    const [isFetching, setIsFetching] = useScroll(() => {
        if(isFetching || countArtists < artists.length || offsetArtists - countArtists == 10) {
            setCountArtists(countArtists + 10)
        }
    })

    const sortArtists = (artists: IArtist[], selectedSort: string) => {
        const sorted = [...artists].sort((a, b) => {
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
        setSortedArtists(sorted);
    };

    useEffect(() => {
        if (artists) {
            sortArtists(artists, selectedSort);
        }
    }, [selectedSort, artists]);

    const handleDeleteArtist = useCallback((id: number) => {
        setSortedArtists(prevArtists => prevArtists?.filter(artist => artist.id !== id) || null);
    }, []);

    return (
        <div ref={parentRef} className={styles.container}>
            {sortedArtists && sortedArtists.map((artist) => (
                <ArtistItem
                    key={artist.id}
                    artist={artist}
                    onDelete={handleDeleteArtist}
                />
            ))}
        </div>
    )
}

ArtistList.displayName = 'ArtistList'

export default memo(ArtistList)
