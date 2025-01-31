import styles from './DeleteContainer.module.scss';
import delete_icon from './delete_icon.svg';

interface DeleteContainerProps {
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const DeleteContainer = ({ onClick }: DeleteContainerProps) => {
  return (
    <div className={styles.delete_container} onClick={onClick}>
      <img src={delete_icon} alt="delete" />
    </div>
  );
};
