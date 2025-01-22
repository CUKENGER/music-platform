import { EntityList } from '@/widgets/EntityList';
import styles from './Albums.module.scss';
import { AlbumItem, useGetAllAlbums } from '@/entities/album';
import { PRIVATE_ROUTES } from '@/shared/consts';

export const Albums = () => {
  return (
    <EntityList
      EntityItem={AlbumItem}
      getAll={useGetAllAlbums}
      toCreate={PRIVATE_ROUTES.CREATE_ALBUM}
      className={styles.AlbumList}
    />
  );
};
