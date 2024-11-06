import { FC } from 'react';
import styles from './NameContainer.module.scss';
import { Link } from 'react-router-dom';

interface NameContainerProps {
  name: string | undefined;
  artist: string | undefined;
  artistId: number;
}

export const NameContainer: FC<NameContainerProps> = ({ name, artist, artistId }) => {
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return (
    <div>
      <div className={styles.name_container}>
        <p className={styles.name}>{name}</p>
        <Link to={`/artists/${artistId}`} onClick={handleLinkClick}>
          <p className={styles.artist}>{artist}</p>
        </Link>
      </div>
    </div>
  );
};
