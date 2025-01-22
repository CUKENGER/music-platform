import { ForwardedRef, forwardRef, useState } from 'react';
import styles from './AlbumItem.module.scss';
import { Link } from 'react-router-dom';
import { useDeleteAlbum } from '../../api/useAlbumApi';
import { IAlbum } from '../../types/Album';
import { useUserStore } from '@/entities/user';
import { API_URL } from '@/shared/consts';
import { useModal } from '@/shared/hooks';
import { MenuItem } from '@/shared/types';
import { Menu, ModalContainer } from '@/shared/ui';

interface AlbumItemProps {
  item: IAlbum;
  itemList: IAlbum[];
}

const AlbumItemComponent = ({ item: album }: AlbumItemProps, ref: ForwardedRef<HTMLDivElement>) => {
  const [isHover, setIsHover] = useState(false);
  const { hideModal, modal, showModal } = useModal();
  const { isAdmin } = useUserStore();
  const { mutate: deleteAlbum } = useDeleteAlbum();

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

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={styles.AlbumItem}
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
      <ModalContainer modal={modal} hideModal={hideModal} />
    </div>
  );
};

export const AlbumItem = forwardRef(AlbumItemComponent);
