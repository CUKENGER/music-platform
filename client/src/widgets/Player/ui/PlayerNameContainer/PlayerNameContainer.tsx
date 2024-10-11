import { FC, useEffect, useRef, useState } from 'react';
import styles from './PlayerNameContainer.module.scss';

interface PlayerNameContainerProps {
  name: string | undefined;
  artist: string | undefined;
}

export const PlayerNameContainer: FC<PlayerNameContainerProps> = ({ name, artist }) => {
  const [isScrollName, setIsScrollName] = useState(false);
  const [isScrollArtist, setIsScrollArtist] = useState(false);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const artistRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if(nameRef.current) {
        setIsScrollName(nameRef.current.scrollWidth > nameRef.current.clientWidth)
      }
      if (artistRef.current) {
        setIsScrollArtist(artistRef.current.scrollWidth > artistRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, [name, artist]);

  return (
    <div>
      <div className={styles.name_container}>
        <p
          ref={nameRef}
          className={`${styles.name} ${isScrollName && styles.scroll}`}
        >
          {name}
        </p>
        <p
          ref={artistRef}
          className={`${styles.artist} ${isScrollArtist && styles.scroll}`}
        >
          {artist}
        </p>
      </div>
    </div>
  );
};
