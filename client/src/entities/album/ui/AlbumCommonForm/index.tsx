import { FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom"
import styles from './AlbumCommonForm.module.scss'
import { Btn } from "@/shared/ui";

interface AlbumCommonFormProps {
  onSubmit: (e: FormEvent) => void;
  backLink: string;
  children: ReactNode;
  isPending: boolean;
  hasData: boolean;
}

export const AlbumCommonForm = ({ onSubmit, backLink, children, isPending, hasData }: AlbumCommonFormProps) => {
  return (
    <form className={styles.Form} onSubmit={onSubmit}>
      <Link to={backLink}>
        <Btn small={true}>Назад</Btn>
      </Link>
      {children}
      <Btn isLoading={isPending} type="submit" disabled={!hasData}>
        Загрузить
      </Btn>
    </form>
  )
}
