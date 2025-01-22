import styles from './PlayerDetailed.module.scss';
import { useState } from 'react';
import { NavItems } from './NavItems';
import { NavText } from './NavText';
import { NavNextTracks } from './NavNextTracks';
import { useOpenPlayerStore } from '@/widgets/Player/model/openPlayerStore';
import { usePlayerStore } from '@/entities/track';
import { CloseIcon } from '@/shared/ui';
import { API_URL } from '@/shared/consts';

export const PlayerDetailed = () => {
  const activeTrack = usePlayerStore((state) => state.activeTrack);
  const { setIsOpen } = useOpenPlayerStore();

  const [selectedNav, setSelectedNav] = useState<'text' | 'next' | 'related'>('text');

  const hookForm = 75983;

  const handleNavChange = (nav: 'text' | 'next' | 'related') => {
    setSelectedNav(nav);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.main_container}>
      <div>
        <CloseIcon className={styles.closeIcon} onClick={handleClose} />
      </div>
      <div className={styles.player_detailed}>
        <div className={styles.cover_container}>
          <div className={styles.cover_inner_container}>
            <img className={styles.cover} src={API_URL + activeTrack?.picture} alt="cover" />
          </div>
        </div>
        <div className={styles.main_nav_container}>
          <NavItems selectedNav={selectedNav} onNavChange={handleNavChange} />
          <div className={styles.info}>
            {selectedNav === 'text' && (
              <div className={styles.container}>
                <NavText />
              </div>
            )}
            {selectedNav === 'next' && (
              <div className={styles.container}>
                <NavNextTracks />
              </div>
            )}
            {selectedNav === 'related' && (
              <div className={styles.container}>
                <p>related</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
