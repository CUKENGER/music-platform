import { TrackItem, useTrackList } from '@/entities';
import { PrivateRoutes } from '@/shared';
import { ItemList } from '@/widgets';
import styles from './Tracks.module.scss'

export const Tracks = () => {
  return (
    <ItemList 
      className={styles.TrackList}
      useItemListHook={useTrackList} 
      ItemComponent={TrackItem} 
      createRoute={PrivateRoutes.CREATE_TRACK} 
    />
  );
}

