import EntitySection from "@/widgets/EntitySection/ui/EntitySection";
import styles from './Home.module.scss'
import { PopularAlbums, PopularTracks } from "@/features";

export const Home = () => {
  return (
    <div className={styles.container}>
      <PopularTracks/>
      <PopularAlbums/>
      <EntitySection
        title="Популярные альбомы"
      />
      <EntitySection
        title="Популярные артисты"
      />
      <EntitySection
        title="Новинки"
      />
    </div>
  );
}
