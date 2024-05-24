import { FC, memo, useCallback, useEffect, useState } from "react";
import styles from './ArtistItem.module.css'
import { IArtist } from "@/types/track";
import { baseUrl } from "@/services/baseUrl";
import Image from 'next/image'
import like from '@/assets/like.png'
import like_fill from '@/assets/like_fill.png'
import plays_icon from '@/assets/plays.png'
import { useAddLikeArtistMutation, useDeleteArtistMutation, useDeleteLikeArtistMutation } from "@/api/ArtistService";
import { useRouter } from "next/router";
import { isAdmin } from "@/services/isAdmin";
import delete_icon from '@/assets/delete.svg'
import useActions from "@/hooks/useActions";
import { searchArtistsActions } from "@/store/reducers/searchArtistsSlice";

interface ArtistItemProps{
    artist: IArtist;
    onDelete: (id: number) => void
}

const ArtistItem:FC<ArtistItemProps> = ({artist, onDelete}) => {

    const router = useRouter()

    const {SetOpenedArtist} = useActions()

    const [isLike, setIsLike] = useState(false)
    const [likes, setLikes] = useState<number>(0)

    const [addLikeArtistMutation] = useAddLikeArtistMutation()
    const [deleteLikeArtistMutation] = useDeleteLikeArtistMutation()
    const [deleteArtistMutation] = useDeleteArtistMutation()

    const handleLike = useCallback(async () => {
        try {
            if (isLike) {
                await deleteLikeArtistMutation(artist.id);
                setLikes(prevLikes => prevLikes - 1);
            } else {
                await addLikeArtistMutation(artist.id);
                setLikes(prevLikes => prevLikes + 1);
            }
            setIsLike(prevIsLike => !prevIsLike);
        } catch(e) {
            console.log('Error handling like:', e);
        }
    }, [addLikeArtistMutation, deleteLikeArtistMutation, artist.id, isLike]);

    useEffect(() => {
        if(artist.likes) {
            setLikes(artist.likes)
        }
    }, [artist.likes])

    const handleRedirect = () => {
        router.push('artists/' + artist.id)
        SetOpenedArtist(artist)
    }

    const handleDelete = useCallback(async () => {
        try {
            await deleteArtistMutation(artist.id);
            onDelete(artist.id);
            console.log('Удалено');
        } catch (e) {
            console.log(e);
        }
    }, [artist.id, deleteArtistMutation, onDelete]);

    return (
        <div className={styles.container}>
            <div className={styles.cover_container}>
                <img className={styles.cover} onClick={handleRedirect} src={baseUrl + artist?.picture} alt='cover icon'/>
            </div>
            <div className={styles.name_container}>
                <p className={styles.name} onClick={handleRedirect}>{artist.name}</p>
            </div>
            <div className={styles.info_container}>
                <div className={styles.like_container} onClick={handleLike}>
                    <Image className={styles.like} src={isLike ? like_fill : like} alt='like icon'/>
                    <p className={styles.like_count}>{likes}</p>
                </div>
                {isAdmin && (
                    <div className={styles.delete_container} onClick={handleDelete}>
                        <Image className={styles.delete_icon} src={delete_icon} alt='like icon'/>
                    </div>
                )}
                <div className={styles.like_container} onClick={handleLike}>
                    <Image className={styles.like} src={plays_icon} alt='like icon'/>
                    <p className={styles.like_count}>{artist?.listens}</p>
                </div>
            </div>
        </div>
    )
}

ArtistItem.displayName = 'ArtistItem'

export default memo(ArtistItem)