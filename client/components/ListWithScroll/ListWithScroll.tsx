import { useEffect, useState } from "react";
import useScroll from "@/hooks/useScroll";
import { sortList } from "@/services/sortList";

interface ListWithScrollProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
  selectedSort: string;
  setCountItems: (count: number) => void;
  countItems: number;
  offsetItems: number;
  styles: { container: string };
}

function ListWithScroll<T>({ items, renderItem, selectedSort, setCountItems, countItems, offsetItems, styles }: ListWithScrollProps<T>) {
  const [sortedItems, setSortedItems] = useState<T[] | null>(null);

  const [isFetching, setIsFetching] = useScroll(() => {
    if (!isFetching && countItems < items.length) {
      setCountItems(countItems + 10);
    }
  });

  useEffect(() => {
    if (items) {
      sortList(items, selectedSort, setSortedItems);
    }
  }, [selectedSort, items]);

  return (
    <div className={styles.container}>
      {sortedItems && sortedItems.map(renderItem)}
    </div>
  );
}

export default ListWithScroll;
