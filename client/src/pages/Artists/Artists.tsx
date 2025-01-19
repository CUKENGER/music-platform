import styles from './Artists.module.scss'
import { ArtistItem, useGetAllArtists } from '@/entities';
import { PrivateRoutes } from '@/shared';
import { EntityList } from '@/widgets/EntityList/EntityList';

export const Artists = () => {
  return (
    <EntityList 
      EntityItem={ArtistItem}
      getAll={useGetAllArtists}
      toCreate={PrivateRoutes.CREATE_ARTIST}
      className={styles.ArtistList}
    />
  );
}
