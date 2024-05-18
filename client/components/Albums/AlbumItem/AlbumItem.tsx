import { IAlbum } from '@/types/track'
import styles from './AlbumItem.module.css'
import { FC } from 'react';
import { baseUrl } from '@/services/baseUrl';
import { useRouter } from 'next/router';
import useActions from '@/hooks/useActions';

interface AlbumItemProps{
    album: IAlbum;
}

const AlbumItem:FC<AlbumItemProps> = ({album}) => {

    const router = useRouter()

    console.log(album.id);

    const {SetOpenedAlbum} = useActions()

    const handleClick = () => {
        router.push('/albums/' + album.id)
        SetOpenedAlbum(album)
    }

    return ( 
        <div className={styles.container}>
            <div className={styles.cover_container}>
                <img 
                    onClick={handleClick}
                    className={styles.cover}
                    src={baseUrl + album.picture} 
                    alt='cover icon'
                />
            </div>
            <div className={styles.info_container}>
                <p className={styles.name} onClick={handleClick}>{album.name}</p>
                <p className={styles.artist}>{album.artist}</p>
            </div>
        </div>
    )
}

export default AlbumItem