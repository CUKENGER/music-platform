import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';
import styles from './ArtistItem.module.scss';
import { Link } from 'react-router-dom';
import { IArtist } from '../../types/Artist';
import { API_URL } from '@/shared/consts';
import { LikeIcon, ListensContainer } from '@/shared/ui';
import cn from 'classnames';

interface ArtistItemProps {
  item: IArtist;
  itemList: IArtist[];
  index?: number;
  style?: React.CSSProperties;
}

const ArtistItemComponent = (
  { item: artist, index, style }: ArtistItemProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsVisible(true);
      },
      (index || 0) * 50,
    );
    return () => clearTimeout(timer);
  }, [index]);
  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn(styles.ArtistItem, isVisible && styles.visible)}
      style={style}
    >
      <Link to={`${artist.id}`}>
        <div className={styles.cover}>
          <img src={API_URL + artist.picture} />
        </div>
      </Link>
      <Link to={`${artist.id}`}>
        <div className={styles.name_container}>
          <p className={styles.name}>{artist.name}</p>
        </div>
      </Link>
      <div className={styles.main_info}>
        <ListensContainer listens={artist.listens} />
        <LikeIcon
          className={styles.likes}
          likes={artist?.likes}
        />
      </div>
    </div>
  );
};

export const ArtistItem = forwardRef(ArtistItemComponent);
