import { FC } from 'react';
import styles from './ArtistItem.module.scss'
import { ApiUrl, LikeIcon, ListensIcon } from '@/shared';
import { IArtist } from '@/entities';
import { Link } from 'react-router-dom';

interface ArtistItemProps {
  item: IArtist;
  itemList: IArtist[]
}

export const ArtistItem: FC<ArtistItemProps> = ({item: artist}) => {

  return (
    <div className={styles.ArtistItem}>
      <Link to={`${artist.id}`}>
        <div className={styles.cover}>
          <img className={styles.cover_img} src={ApiUrl + artist.picture}/>
        </div>
      </Link>
      <Link to={`${artist.id}`}>
        <div className={styles.name_container}>
          <p className={styles.name}>{artist.name}</p>
        </div>
      </Link>
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