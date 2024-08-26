import { memo, useCallback, useState } from "react";
import NavItems from "../NavItems/NavItems";
import NavNextTracks from "../NavNextTracks/NavNextTracks";
import NavText from "../NavText/NavText";
import styles from './NavContainer.module.scss';

const NavContainer = () => {
  const [selectedNav, setSelectedNav] = useState<'text' | 'next' | 'related'>('text');

  const handleNavChange = useCallback((nav: 'text' | 'next' | 'related') => {
    setSelectedNav(nav);
  }, []);

  return (
    <div className={styles.main_nav_container}>
      <NavItems 
        selectedNav={selectedNav} 
        onNavChange={handleNavChange} 
      />
      <div className={styles.info}>
        {selectedNav === 'text' && <NavText/>}
        {selectedNav === 'next' && <NavNextTracks/>}
        {selectedNav === 'related' && <p>related</p>}
      </div>
    </div>
  );
};

export default memo(NavContainer);
