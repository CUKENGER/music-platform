import styles from './NavTo.module.scss';
import homeIcon from './assets/home.svg';
import trackListIcon from './assets/tracklist.svg';
import albumListIcon from './assets/albumList.svg';
import artistListIcon from './assets/artistList.svg';
import NavItem from './NavItem';

export const NavTo = () => {
  const routes = [
    { id: 1, title: 'Главная', icon: homeIcon, path: '/' },
    { id: 2, title: 'Треки', icon: trackListIcon, path: '/tracks' },
    { id: 3, title: 'Альбомы', icon: albumListIcon, path: '/albums' },
    { id: 4, title: 'Артисты', icon: artistListIcon, path: '/artists' },
  ];

  return (
    <div className={styles.route_list}>
      {routes.map((route) => (
        <NavItem key={route.id} icon={route.icon} path={route.path} title={route.title} />
      ))}
    </div>
  );
};
