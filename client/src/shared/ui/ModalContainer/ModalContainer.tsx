import { FC, ReactNode } from "react";
import styles from './ModalContainer.module.scss'
import closeIcon from './krest.svg'
import { Btn } from "../Btn/Btn";

interface ModalContainerProps {
  text: string | ReactNode;
  hideModal: () => void;
  onClick?: () => void;
}

export const ModalContainer: FC<ModalContainerProps> = ({ text, hideModal, onClick }) => {

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
      <div className={`${styles.container} ${styles.visible_container}`} onClick={handleNotClose}>
        <div className={styles.x_container}>
          <div className={styles.x_icon_container}>
            <img
              className={styles.x_icon}
              onClick={handleClose}
              src={closeIcon}
              alt='close'
            />
          </div>
        </div>
        <div className={styles.main_container}>
          <p className={styles.text}>{text}</p>
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
