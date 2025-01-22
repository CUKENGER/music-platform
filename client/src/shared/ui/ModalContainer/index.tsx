import { ModalState } from '@/shared/types';
import styles from './ModalContainer.module.scss';
import closeIcon from './krest.svg';
import { Btn } from '../Btn';

interface ModalContainerProps {
  modal: ModalState;
  hideModal: () => void;
}

export const ModalContainer = ({ hideModal, modal }: ModalContainerProps) => {
  const handleClose = () => {
    hideModal();
    if (modal.onClick) {
      modal.onClick();
    }
  };

  const handleNotClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!modal.isOpen) {
    return null;
  }

  return (
    <div className={`${styles.overlay} ${styles.visible}`} onClick={handleClose}>
      <div className={`${styles.container} ${styles.visible_container}`} onClick={handleNotClose}>
        <div className={styles.x_container}>
          <div className={styles.x_icon_container}>
            <img className={styles.x_icon} onClick={handleClose} src={closeIcon} alt="close" />
          </div>
        </div>
        <div className={styles.main_container}>
          <p className={styles.text}>{modal.text}</p>
        </div>
        <div className={styles.btn_container}>
          <Btn onClick={handleClose} small={true}>
            Закрыть
          </Btn>
        </div>
      </div>
    </div>
  );
};
