import { memo, useState, useCallback } from "react";
import styles from './NavContainer.module.scss';
import NavItems from "./NavItems";
import NavText from "./NavText";
import NavNextTracks from "./NavNextTracks";

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
