import { FC, memo } from 'react';
import styles from './ModalContainer.module.css';
import Btn from '../Btn/Btn';
import krest from '@/assets/krest.png';
import Image from 'next/image';

interface ModalContainerProps {
    text: string;
    hideModal: () => void;
    onClick?: () => void;
}

const ModalContainer: FC<ModalContainerProps> = memo(({ text, hideModal, onClick }) => {
    const handleClose = () => {
        hideModal();
        if (onClick) {
            onClick();
        }
    };

    return (
        <div className={`${styles.overlay} ${styles.visible}`}>
            <div className={styles.container}>
                <div className={styles.x_container}>
                    <Image
                        className={styles.x_icon}
                        onClick={handleClose}
                        quality={100}
                        src={krest}
                        alt='close icon'
                    />
                </div>
                <div className={styles.main_container}>
                    <p className={styles.text}>{text}</p>
                </div>
                <div className={styles.btn_container}>
                    <Btn onClick={handleClose}>
                        Закрыть
                    </Btn>
                </div>
            </div>
        </div>
    );
});

export default ModalContainer;
