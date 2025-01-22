import { LoginLayout } from '@/entities/user';
import { PUBLIC_ROUTES } from '@/shared/consts';
import { Btn, ModalContainer, UIPasswordInput, UITextField } from '@/shared/ui';
import { Link } from 'react-router-dom';
import { useRegWidget } from '../model/useRegForm';
import cl from './index.module.scss';

export const RegForm = () => {
  const {
    email,
    password,
    username,
    handleSubmit,
    repeatPassword,
    isValid,
    isLoading,
    modal,
    hideModal,
  } = useRegWidget();

  const usernameWarnings = [
    {
      condition: username?.isEmpty,
      text: 'Поле должно быть заполнено',
    },
    {
      condition: !username?.isLatin,
      text: 'Поля заполняются латиницей',
    },
    {
      condition: !username?.isLengthValid,
      text: 'Длина никнейма должна быть от 3 до 16 символов',
    },
  ];

  const emailWarnings = [
    {
      condition: email?.isEmpty,
      text: 'Поле должно быть заполнено',
    },
    { condition: !email?.isEmailValid, text: 'Некорректный email' },
    {
      condition: !email?.isLatin,
      text: 'Поле заполняется латиницей',
    },
  ];

  const passwordWarnings = [
    {
      condition: password?.isEmpty,
      text: 'Поле должно быть заполнено',
    },
    {
      condition: !password?.isPasswordStrong,
      text: 'Пароль должен содержать минимум 8 символов, заглавные буквы и цифры',
    },
    {
      condition: !password?.isLatin,
      text: 'Поля заполняются латиницей',
    },
  ];

  const repeatPasswordWarnings = [
    {
      condition: !repeatPassword?.isPassEqual,
      text: 'Пароли не совпадают',
    },
  ];

  return (
    <>
      <LoginLayout handleSubmit={handleSubmit} title="Регистрация">
        <UITextField
          name="username"
          label="Введите никнейм"
          required
          onChange={username.onChange}
          value={username.value}
          warnings={usernameWarnings}
          clearable
        />
        <UITextField
          name="email"
          type="email"
          label="Введите email"
          required
          value={email.value}
          onChange={email.onChange}
          warnings={emailWarnings}
          clearable
        />
        <UIPasswordInput
          name="password"
          label="Введите пароль"
          required
          value={password.value}
          onChange={password.onChange}
          warnings={passwordWarnings}
          clearable
        />
        <UIPasswordInput
          name="repeatPassword"
          label="Повторите пароль"
          required
          value={repeatPassword.value}
          onChange={repeatPassword.onChange}
          warnings={repeatPasswordWarnings}
          clearable
        />
        <Btn isLoading={isLoading} disabled={isValid} type="submit">
          Зарегистрироваться
        </Btn>
        <Link to={PUBLIC_ROUTES.LOGIN}>
          <Btn variant="outlined" className={cl.link}>
            Авторизация
          </Btn>
        </Link>
      </LoginLayout>
      <ModalContainer modal={modal} hideModal={hideModal} />
    </>
  );
};
