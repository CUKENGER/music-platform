import { FC, useState } from 'react';
import styles from './AlbumItem.module.scss'
import { ApiUrl, Menu, MenuItem, ModalContainer, useModal} from '@/shared';
import { Link } from 'react-router-dom';
import { IAlbum, useUserStore } from '@/entities';
import { useDeleteAlbum } from '../../api/useAlbumApi';

interface AlbumItemProps {
  item: IAlbum;
  itemList: IAlbum[];
}

export const AlbumItem:FC<AlbumItemProps> = ({item: album}) => {

  const [isHover, setIsHover]= useState(false)
  const {hideModal, modal, showModal} = useModal()
  const {isAdmin} = useUserStore()
  const {mutate: deleteAlbum} = useDeleteAlbum()

  const handleDelete = () => {
    deleteAlbum(album.id, {
      onSuccess: (res) => {
        showModal(`Альбом ${res?.name} успешно удален`)
      },
      onError: (e) => {
        showModal(`Произошла ошибка при удалении: ${e}`)
      }
    })
  }

  const items: MenuItem[] = [
    { text: 'Удалить', onClick: handleDelete },
  ];

  return (
    <div 
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={styles.AlbumItem}
    >
      <Link to={`/albums/${album.id}`}>
        <div className={styles.cover}>
          <img src={ApiUrl + album.picture}/>
        </div>
      </Link>
      <div className={styles.main_info}>
        <div className={styles.main_info_left}>
          <Link to={`/albums/${album.id}`}>
            <p className={styles.name}>{album.name}</p>
          </Link>
          <Link to={`/artist/${album.id}`}>
            <p className={styles.artist}>{album.artist.name}</p>
          </Link>
        </div>
        {isAdmin && (
          <div className={isHover ? styles.menu : styles.noMenu}>
            <Menu items={items}/>
          </div>
        )}
      </div>
      {modal.isOpen && (
        <ModalContainer
          hideModal={hideModal}
          text={modal.message}
          onClick={modal.onClick}
        />
      )}
    </div>
  )
}