import { FC, memo } from "react";
import styles from './ArtistAlbumList.module.css'
import Image from "next/image";
import ArtistAlbumItem from "./ArtistAlbumItem/ArtistAlbumItem";
import { IAlbum } from "@/types/track";

interface ArtistAlbumListProps{
    albums: IAlbum[]
}

const ArtistAlbumList:FC<ArtistAlbumListProps> = memo(({albums}) => {
    return (
        <>  
            <p>Альбомы</p>
            <div className={styles.container}>
                {albums.map((album) => (
                    <ArtistAlbumItem key={album.id} album={album}/>
                ))}
                
            </div>  
        </>
    )
})

export default ArtistAlbumList