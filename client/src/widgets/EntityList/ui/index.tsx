import styles from './EntityList.module.scss';
import { useCallback, useRef } from 'react';
import React from 'react';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useSelectFilterStore } from '@/shared/model';
import { Loader } from '@/shared/ui';
import { PageHeader } from '@/widgets/PageHeader';

interface EntityItemProps<T> {
  item: T;
  itemList: T[];
}

interface EntityListProps<T> {
  EntityItem: React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement> & EntityItemProps<T>>;
  getAll: (sortBy: string) => UseInfiniteQueryResult<InfiniteData<T[]>, unknown>;
  toCreate: string;
  className: string;
}

export const EntityList = <T extends { id: number }>({ EntityItem, getAll, toCreate, className }: EntityListProps<T>) => {
  const selectedSort = useSelectFilterStore(state => state.selectedSort);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = getAll(selectedSort);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback(
    (node: Element | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (error) return 'An error has occurred: ' + error;

  if (isLoading) {
    return <Loader />;
  }

  const allItems = data?.pages.flat() || [];

  return (
    <div className={styles.EntityList}>
      <PageHeader toCreate={toCreate} />
      <div className={className}>
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.map((item, i) => {
              if (page.length === i + 1) {
                return (
                  <EntityItem
                    ref={lastItemRef}
                    item={item}
                    itemList={allItems}
                    key={item.id}
                  />
                );
              } else {
                return (
                  <EntityItem
                    item={item}
                    itemList={allItems}
                    key={item.id}
                  />
                );
              }
            })}
          </React.Fragment>
        ))}
        <div>
          {isFetching && !isFetchingNextPage ? 'Fetching...' : null}
        </div>
      </div>
    </div>
  );
};
