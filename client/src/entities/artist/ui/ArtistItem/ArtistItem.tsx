import { FC } from 'react';
import styles from './ArtistItem.module.scss'
import { ApiUrl, LikeIcon, ListensIcon } from '@/shared';
import { IArtist } from '@/entities';

interface ArtistItemProps {
  item: IArtist;
  itemList: IArtist[]
}

export const ArtistItem: FC<ArtistItemProps> = ({item: artist}) => {

  return (
    <div className={styles.ArtistItem}>
      <div className={styles.cover}>
        <img className={styles.cover_img} src={ApiUrl + artist.picture}/>
      </div>
      <div className={styles.name_container}>
        <p className={styles.name}>{artist.name}</p>
      </div>
      <div className={styles.main_info}>
        <ListensIcon
          listens={artist.listens}
        />
        <LikeIcon
          className={styles.likes}
          likes={artist?.likes}
        />
      </div>
    </div>
  )
}