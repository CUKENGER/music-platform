import { AlbumItem, useGetAllAlbums } from "@/entities";
import { PrivateRoutes } from "@/shared";
import styles from './Albums.module.scss'
import { EntityList } from "@/widgets/EntityList/EntityList";

export const Albums = () => {
  return (
    <EntityList 
      EntityItem={AlbumItem}
      getAll={useGetAllAlbums}
      toCreate={PrivateRoutes.CREATE_ALBUM}
      className={styles.AlbumList}
    />
  );
}
