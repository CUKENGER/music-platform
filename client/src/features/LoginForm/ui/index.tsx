import { FormEvent, ReactNode } from 'react';
import styles from './LoginForm.module.scss';
import { Link } from 'react-router-dom';
import { UseInputProps } from '@/shared/types';
import { Btn, EmailInput } from '@/shared/ui';
import { PUBLIC_ROUTES } from '@/shared/consts';

interface LoginFormProps {
  btnText: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children?: ReactNode;
  isLogin?: boolean;
  email: UseInputProps;
  password: UseInputProps;
  needRepeatPassword?: boolean;
  repeatPassword?: UseInputProps;
  isLoading?: boolean;
  isActiveBtn?: boolean;
}

export const LoginForm = ({
  btnText,
  handleSubmit,
  children,
  isLogin = true,
  email,
  password,
  needRepeatPassword = false,
  repeatPassword,
  isLoading = false,
  isActiveBtn = true,
}: LoginFormProps) => {
  return (
    <form className={styles.LoginForm} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Welcome</h1>
      {children}
      <EmailInput name="email" inputValue={email} placeholder="Введите email" />
      {isLogin && (
        <Link to={PublicRoutes.SEND_EMAIL}>
          <span className={styles.forgotPassword}>Забыли пароль?</span>
        </Link>
      )}
      <Btn isLoading={isLoading} disabled={isActiveBtn} type="submit">
        {btnText}
      </Btn>
      <Link to={isLogin ? PUBLIC_ROUTES.REGISTRATION : PUBLIC_ROUTES.LOGIN}>
        <Btn className={styles.reg_btn} type="button">
          {isLogin ? 'Регистрация' : 'Авторизация'}
        </Btn>
      </Link>
    </form>
  );
};
