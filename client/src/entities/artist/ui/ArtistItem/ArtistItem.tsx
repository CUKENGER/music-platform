import { ForwardedRef, forwardRef } from 'react';
import styles from './ArtistItem.module.scss'
import { ApiUrl, LikeIcon, ListensIcon } from '@/shared';
import { IArtist } from '@/entities';
import { Link } from 'react-router-dom';

interface ArtistItemProps {
  item: IArtist;
  itemList: IArtist[]
}

const ArtistItemComponent = ({item: artist} : ArtistItemProps, ref: ForwardedRef<HTMLDivElement>) => {

  return (
    <div ref={ref} className={styles.ArtistItem}>
      <Link to={`${artist.id}`}>
        <div className={styles.cover}>
          <img src={ApiUrl + artist.picture}/>
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

export const ArtistItem = forwardRef(ArtistItemComponent)