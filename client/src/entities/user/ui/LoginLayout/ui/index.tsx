import { FormEvent, ReactNode } from 'react';
import styles from './LoginLayout.module.scss';

interface LoginLayoutProps {
  title: string;
  children: ReactNode;
  handleSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

export const LoginLayout = ({ title, handleSubmit, children }: LoginLayoutProps) => {
  return (
    <div className={styles.container}>
      <form className={styles.Layout} onSubmit={handleSubmit}>
        <h1 className={styles.title}>{title}</h1>
        {children}
      </form>
    </div>
  );
};
