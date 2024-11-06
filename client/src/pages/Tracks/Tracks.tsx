import { TrackItem, useTrackList } from '@/entities';
import { Loader, PrivateRoutes} from '@/shared';
import { PageHeader } from '@/widgets';
import styles from './Tracks.module.scss'

export const Tracks = () => {

  const { items, isLoading, error, isError } = useTrackList();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>{error?.message}</p>;
  }

  return (
    // <ItemList 
    //   className={styles.TrackList}
    //   useItemListHook={useTrackList} 
    //   ItemComponent={TrackItem} 
    //   createRoute={PrivateRoutes.CREATE_TRACK} 
    // />
    <div className={styles.ItemList}>
      <PageHeader toCreate={PrivateRoutes.CREATE_TRACK} />
      <div className={styles.TrackList}>
        {items.map((item) => (
          <TrackItem
            key={item.id}
            itemList={items}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}

