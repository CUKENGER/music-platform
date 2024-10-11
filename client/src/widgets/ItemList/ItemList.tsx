import { Loader } from "@/shared";
import { PageHeader } from "@/widgets";
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './ItemList.module.scss'

interface Identifiable {
  id: number;
}

interface ItemListProps<T extends Identifiable> {
  useItemListHook: () => {
    items: T[];
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isLoader: boolean;
  };
  ItemComponent: React.FC<{ item: T; itemList: T[];}>;
  createRoute: string;
  className: string
}

export const ItemList = <T extends Identifiable>({ useItemListHook, ItemComponent, createRoute, className }: ItemListProps<T>) => {
  const { items, isLoading, error, isError } = useItemListHook();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <p>{error?.message}</p>;
  }

  return (
    <div className={styles.ItemList}>
      <PageHeader toCreate={createRoute} />
      <div className={className}>
        {items.map((item) => (
          <ItemComponent
            key={item.id}
            itemList={items}
            item={item}
          />
        ))}
      </div>
      {items.length < 1 && (
        <div className={styles.noData}>
          Данных пока нет
        </div>
      )}
    </div>
  );
};