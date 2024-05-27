import { FC, memo, useCallback, useEffect, useState } from "react";
import styles from './ArtistAlbumItem.module.css'
import Image from "next/image";
import { IAlbum } from "@/types/track";
import { baseUrl } from "@/services/baseUrl";
import like from '@/assets/like.png'
import like_fill from '@/assets/like_fill.png'
import delete_icon from '@/assets/delete.svg'
import plays_icon from '@/assets/plays.png'
import { useAddLikeAlbumMutation, useDeleteAlbumMutation, useDeleteLikeAlbumMutation} from "@/api/AlbumService";
import { useRouter } from "next/router";
import useActions from "@/hooks/useActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";

interface ArtistAlbumItemProps{
    album: IAlbum
}

const ArtistAlbumItem:FC<ArtistAlbumItemProps> = memo(({album}) => {
    const router = useRouter()
    const [likes, setLikes] = useState(0)
    const [isLike, setIsLike] = useState(false)

    const {openedAlbum} = useTypedSelector(state => state.searchAlbumsReducer)
    const {SetOpenedAlbum} = useActions()

    const [addLikeAlbum] = useAddLikeAlbumMutation()
    const [deleteLikeAlbum] = useDeleteLikeAlbumMutation()
    const [deleteAlbum] = useDeleteAlbumMutation()

    const handleAddLike = useCallback(async () => {
        try {
            if (isLike) {
                await addLikeAlbum(album.id);
                setLikes(prevLikes => prevLikes - 1);
            } else {
                await deleteLikeAlbum(album.id);
                setLikes(prevLikes => prevLikes + 1);
            }
            setIsLike(prevIsLike => !prevIsLike);
        } catch(e) {
            console.log('Error handling like:', e);
        }
    }, [album.id, isLike]);

    const handleRedirect = () => {
        router.push('/albums/' + album.id)
        SetOpenedAlbum(album)
    }

    const handleDelete = useCallback(async () => {
        try {
            await deleteAlbum(album.id);
            console.log('Удалено');
        } catch (e) {
            console.log(e);
        }
    }, [album.id]);

    useEffect(() => {
        if(album.likes) {
            setLikes(album.likes)
        }
    }, [album.likes])

    console.log(openedAlbum);

    return (
        <div className={styles.container}>
            <div className={styles.cover_container} onClick={handleRedirect}>
                <img className={styles.cover} src={baseUrl + album?.picture} alt='cover icon'/>
            </div>
            <div className={styles.name_container} onClick={handleRedirect}>
                <p className={styles.name}>{album.name}</p>
            </div>
            <div className={styles.info_container}>
                <div className={styles.like_container} onClick={handleAddLike} >
                    <Image className={styles.like} src={isLike ? like_fill : like} alt='like icon'/>
                    <p className={styles.like_count}>{album.likes}</p>
                </div>
                {(
                    <div className={styles.delete_container} onClick={handleDelete}>
                        <Image className={styles.delete_icon} src={delete_icon} alt='like icon'/>
                    </div>
                )}
                <div className={styles.plays_container}>
                    <Image className={styles.plays} src={plays_icon} alt='like icon'/>
                    <p className={styles.like_count}>{album.listens}</p>
                </div>
            </div>
        </div> 
    )
})

export default ArtistAlbumItem