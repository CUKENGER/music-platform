import { LoginLayout } from '@/entities/user';
import { PUBLIC_ROUTES } from '@/shared/consts';
import { Btn, ModalContainer, UIPasswordInput, UITextField } from '@/shared/ui';
import { Link } from 'react-router-dom';
import { useLoginWidget } from '../model/useLoginForm';
import cl from './index.module.scss';

export const LoginForm = () => {
  const { email, password, handleSubmit, isLoading, isValid, modal, hideModal } = useLoginWidget();

  const emailWarnings = [
    {
      condition: email.isEmpty,
      text: 'Поле должно быть заполнено',
    },
    {
      condition: !email.isEmailValid,
      text: 'Некорректный emall',
    },
    {
      condition: !email.isLatin,
      text: 'Поле заполняется латиницей',
    },
  ];

  const passwordWarnings = [
    {
      condition: password.isEmpty,
      text: 'Поле должно быть заполнено',
    },
    {
      condition: !password.isPasswordStrong,
      text: 'Пароль должен содержать минимум 8 символов, заглавные буквы и цифры',
    },
    {
      condition: !password.isLatin,
      text: 'Поля заполняются латиницей',
    },
  ];

  return (
    <>
      <LoginLayout handleSubmit={handleSubmit} title="Вход">
        <UITextField
          name="email"
          type="email"
          label="Введите email"
          value={email.value}
          onChange={email.onChange}
          clearable
          required
          warnings={emailWarnings}
        />

        <UIPasswordInput
          name="password"
          label="Введите пароль"
          clearable
          required
          onChange={password.onChange}
          value={password.value}
          warnings={passwordWarnings}
        />
        <Btn isLoading={isLoading} disabled={isValid} type="submit">
          Зарегистрироваться
        </Btn>
        <Link to={PUBLIC_ROUTES.REGISTRATION}>
          <Btn variant="outlined" className={cl.link}>
            Регистрация
          </Btn>
        </Link>
      </LoginLayout>
      <ModalContainer modal={modal} hideModal={hideModal} />
    </>
  );
};
