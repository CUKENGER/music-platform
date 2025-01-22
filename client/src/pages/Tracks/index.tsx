import { EntityList } from '@/widgets/EntityList';
import styles from './Tracks.module.scss';
import { TrackItem, useGetAllTracks } from '@/entities/track';
import { PRIVATE_ROUTES } from '@/shared/consts';

export const Tracks = () => {
  return (
    <EntityList
      EntityItem={TrackItem}
      className={styles.TrackList}
      getAll={useGetAllTracks}
      toCreate={PRIVATE_ROUTES.CREATE_TRACK}
    />
  );
};
