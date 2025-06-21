import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';
import styles from './AlbumItem.module.scss';
import { Link } from 'react-router-dom';
import { useDeleteAlbum } from '../../api/useAlbumApi';
import { IAlbum } from '../../types/Album';
import { useUserStore } from '@/entities/user';
import { API_URL } from '@/shared/consts';
import { useModal } from '@/shared/hooks';
import { MenuItem } from '@/shared/types';
import { Menu, ModalContainer } from '@/shared/ui';
import cn from 'classnames';

interface AlbumItemProps {
  item: IAlbum;
  itemList: IAlbum[];
  index?: number;
  style?: React.CSSProperties;
}

const AlbumItemComponent = (
  { item: album, index, style }: AlbumItemProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const [isHover, setIsHover] = useState(false);
  const { hideModal, modal, showModal } = useModal();
  const { isAdmin } = useUserStore();
  const { mutate: deleteAlbum } = useDeleteAlbum();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleDelete = () => {
    deleteAlbum(album.id, {
      onSuccess: (res) => {
        showModal(`Альбом ${res?.name} успешно удален`);
      },
      onError: (e) => {
        showModal(`Произошла ошибка при удалении: ${e}`);
      },
    });
  };
  const items: MenuItem[] = [{ text: 'Удалить', onClick: handleDelete }];

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsVisible(true);
      },
      (index || 0) * 50,
    );
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={cn(styles.AlbumItem, isVisible && styles.visible)}
      style={style}
    >
      <Link to={`/albums/${album.id}`}>
        <div className={styles.cover}>
          <img src={API_URL + album.picture} />
        </div>
      </Link>
      <div className={styles.main_info}>
        <div className={styles.main_info_left}>
          <Link to={`/albums/${album.id}`}>
            <p className={styles.name}>{album.name}</p>
          </Link>
          <Link to={`/artists/${album.artist?.id}`}>
            <p className={styles.artist}>{album.artist.name}</p>
          </Link>
        </div>
        {isAdmin && (
          <div className={isHover ? styles.menu : styles.noMenu}>
            <Menu items={items} />
          </div>
        )}
      </div>
      <ModalContainer
        modal={modal}
        hideModal={hideModal}
      />
    </div>
  );
};

export const AlbumItem = forwardRef(AlbumItemComponent);
