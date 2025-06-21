import { EntityList } from '@/widgets/EntityList';
import styles from './Artists.module.scss';
import { ArtistItem, useGetAllArtists } from '@/entities/artist';
import { PRIVATE_ROUTES } from '@/shared/consts';

export const Artists = () => {
  return (
    <EntityList
      EntityItem={ArtistItem}
      getAll={useGetAllArtists}
      toCreate={PRIVATE_ROUTES.CREATE_ARTIST}
      className={styles.ArtistList}
    />
  );
};
