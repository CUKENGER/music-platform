import { FC, memo, ReactNode } from "react";
import styles from './ModalContainer.module.scss'
import krestIcon from '../assets/krest.svg'

interface ModalContainerProps {
  text: string | ReactNode;
  hideModal: () => void;
  onClick?: () => void;
}

const ModalContainer: FC<ModalContainerProps> = ({ text, hideModal, onClick }) => {

  const handleClose = () => {
    hideModal();
    if (onClick) {
      onClick();
    }
  };

  const handleNotClose =(e: React.MouseEvent<HTMLDivElement>) =>{
    e.stopPropagation()
  }

  return (
    <div className={`${styles.overlay} ${styles.visible}`} onClick={handleClose}>
      <div className={styles.container} onClick={handleNotClose}>
        <div className={styles.x_container}>
          <img
            className={styles.x_icon}
            onClick={handleClose}
            src={krestIcon}
            alt='close icon'
          />
        </div>
        <div className={styles.main_container}>
          <p className={styles.text}>{text}</p>
        </div>
        <div className={styles.btn_container}>
          <button onClick={handleClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalContainer);