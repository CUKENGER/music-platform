import { FormEvent, ReactNode } from 'react';
import styles from './AlbumCommonForm.module.scss';

interface AlbumCommonFormProps {
  onSubmit: (e: FormEvent) => void;
  backLink: string;
  children: ReactNode;
  isPending: boolean;
  hasData: boolean;
}

export const AlbumCommonForm = ({
  onSubmit,
  backLink,
  children,
  isPending,
  hasData,
}: AlbumCommonFormProps) => {
  return (
    <form className={styles.Form} onSubmit={onSubmit}>
      <Link to={backLink}>
        <Btn>Назад</Btn>
      </Link>
      {children}
      <Btn isLoading={isPending} type="submit" disabled={!hasData}>
        Загрузить
      </Btn>
    </form>
  );
};
