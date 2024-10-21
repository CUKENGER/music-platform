import { AlbumItem, useAlbumList } from "@/entities";
import { PrivateRoutes } from "@/shared";
import { ItemList } from "@/widgets";
import styles from './Albums.module.scss'

export const Albums = () => {
  return (
    <ItemList 
      className={styles.AlbumList}
      useItemListHook={useAlbumList} 
      ItemComponent={AlbumItem} 
      createRoute={PrivateRoutes.CREATE_ALBUM} 
    />
  );
}
