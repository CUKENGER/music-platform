import styles from './EntityList.module.scss';
import { CSSProperties, useCallback, useRef } from 'react';
import React from 'react';
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import { useSelectFilterStore } from '@/shared/model';
import { Loader } from '@/shared/ui';
import { PageHeader } from '@/widgets/PageHeader';

interface EntityItemProps<T> {
  item: T;
  itemList: T[];
  index?: number;
  style?: CSSProperties;
}

interface EntityListProps<T> {
  EntityItem: React.ForwardRefExoticComponent<
    React.RefAttributes<HTMLDivElement> & EntityItemProps<T>
  >;
  getAll: (
    sortBy: string,
  ) => UseInfiniteQueryResult<InfiniteData<{ data: T[]; hasNextPage: boolean }>, unknown>;
  toCreate: string;
  className: string;
}

export const EntityList = <T extends { id: number }>({
  EntityItem,
  getAll,
  toCreate,
  className,
}: EntityListProps<T>) => {
  const selectedSort = useSelectFilterStore((state) => state.selectedSort);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } =
    getAll(selectedSort);

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
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  );

  if (isLoading) {
    return <Loader />;
  }

  const allItems = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className={styles.EntityList}>
      <PageHeader toCreate={toCreate} />
      <div className={className}>
        {data ?
          data.pages.map((page, pageIndex) =>
            page.data ?
              <React.Fragment key={pageIndex}>
                {page.data.map((item, itemIndex) => {
                  const globalIndex =
                    data.pages
                      .slice(0, pageIndex)
                      .reduce((acc, p) => acc + (p ? p.data.length : 0), 0) + itemIndex;
                  return (
                    <EntityItem
                      ref={page.data.length === itemIndex + 1 ? lastItemRef : null}
                      item={item}
                      itemList={allItems}
                      key={item.id}
                      index={globalIndex}
                      style={
                        { '--animation-delay': `${globalIndex * 0.01}s` } as React.CSSProperties
                      }
                    />
                  );
                })}
              </React.Fragment>
            : <p
                key={pageIndex}
                className={styles.NotFound}
              >
                Ничего не найдено
              </p>,
          )
        : <p className={styles.NotFound}>Ничего не найдено</p>}
        <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
      </div>
    </div>
  );
};
