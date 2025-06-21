import { PopularTracks } from '@/features/PopularTracks';
import styles from './Home.module.scss';
import { PopularAlbums } from '@/features/PopularAlbums';
import { EntitySection } from '@/widgets/EntitySection';

export const Home = () => {
  return (
    <div className={styles.container}>
      <PopularTracks />
      <PopularAlbums />
      <EntitySection title="Популярные альбомы" />
      <EntitySection title="Популярные артисты" />
      <EntitySection title="Новинки" />
    </div>
  );
};
