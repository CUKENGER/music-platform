import { FC} from "react";
import styles from './DeleteContainer.module.scss'
import delete_icon from './delete_icon.svg'

interface DeleteContainerProps{
  onClick: () => void
}

export const DeleteContainer:FC<DeleteContainerProps> = ({onClick}) => {

  return (
    <div className={styles.delete_container} onClick={onClick}>
      <img className={styles.delete_icon} src={delete_icon} alt="delete" />
    </div>
  );
};
