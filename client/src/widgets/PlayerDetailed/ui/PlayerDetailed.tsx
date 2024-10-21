import { ApiUrl, CloseIcon } from '@/shared';
import styles from './PlayerDetailed.module.scss';
import { usePlayerStore } from '@/entities';
import { useState } from 'react';
import { NavItems } from './NavItems/NavItems';
import { NavText } from './NavText/NavText';
import { NavNextTracks } from './NavNextTracks/NavNextTracks';
import { useOpenPlayerStore } from '@/widgets/Player/model/openPlayerStore';
import { motion } from 'framer-motion';

export const PlayerDetailed = () => {
  const { activeTrack } = usePlayerStore();
  const { setIsOpen } = useOpenPlayerStore();
  
  const [selectedNav, setSelectedNav] = useState<'text' | 'next' | 'related'>('text');

  const handleNavChange = (nav: 'text' | 'next' | 'related') => {
    setSelectedNav(nav);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
      <motion.div
        className={styles.main_container}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        // exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <CloseIcon 
            className={styles.closeIcon}
            onClick={handleClose}
          />
        </div>
        <div className={styles.player_detailed}>
          <div className={styles.cover_container}>
            <div className={styles.cover_inner_container}>
              <img
                className={styles.cover}
                src={ApiUrl + activeTrack?.picture}
                alt="cover"
              />
            </div>
          </div>
          <div className={styles.main_nav_container}>
            <NavItems
              selectedNav={selectedNav}
              onNavChange={handleNavChange}
            />
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
      </motion.div>
  );
};