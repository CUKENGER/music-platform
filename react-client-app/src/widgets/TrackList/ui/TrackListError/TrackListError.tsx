import Btn from "@/shared/ui/Btn/Btn";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit/react";
import { FC, memo } from "react";
import styles from './TrackListError.module.scss';

interface TrackListErrorProps{
  refetch: () => void
  error: FetchBaseQueryError | SerializedError
}

const TrackListError:FC<TrackListErrorProps> = ({refetch, error}) => {

  let errorMessage;

  if ('status' in error) { // FetchBaseQueryError
    errorMessage = `Ошибка ${error.status}: ${error.data}`;
  } else if ('message' in error) { // SerializedError
    errorMessage = error.message;
  } else {
    errorMessage = 'Неизвестная ошибка';
  }

  const handleClick = () => {
    refetch()
  }

  return (
    <div className={styles.TrackList}>
      <p className={styles.title}>Произошла ошибка попробуйте еще раз</p>
      <p>{errorMessage}</p>
      <Btn onClick={handleClick}>
        Повторить
      </Btn>
    </div>
  );
};

export default memo(TrackListError);