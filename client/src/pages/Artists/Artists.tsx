import { ItemList } from '@/widgets';
import styles from './Artists.module.scss'
import { ArtistItem, useArtistList } from '@/entities';
import { PrivateRoutes } from '@/shared';

export const Artists = () => {
  return (
    <ItemList 
      className={styles.ArtistList}
      useItemListHook={useArtistList} 
      ItemComponent={ArtistItem} 
      createRoute={PrivateRoutes.CREATE_ARTIST} 
    />
  );
}
