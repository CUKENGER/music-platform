import { LoginLayout } from '@/entities/user';
import { PUBLIC_ROUTES } from '@/shared/consts';
import { Btn, ModalContainer, UIPasswordInput, UITextField } from '@/shared/ui';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../model/useLoginForm';
import cl from './index.module.scss';
import { Controller } from 'react-hook-form';

export const LoginForm = () => {
  const {
    handleSubmit,
    control,
    errors,
    isLoading,
    isValid,
    modal,
    hideModal,
  } = useLoginForm();

  return (
    <>
      <LoginLayout handleSubmit={handleSubmit} title="Вход">
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <UITextField
              {...field}
              name="email"
              label="Введите email"
              required
              aria-invalid={!!errors.email}
              warnings={[{ condition: errors.email, text: errors.email?.message }]}
              clearable
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <UIPasswordInput
              {...field}
              name="password"
              label="Введите пароль"
              required
              aria-invalid={!!errors.password}
              warnings={[{ condition: errors.password, text: errors.password?.message }]}
              clearable
            />
          )}
        />
        <Btn isLoading={isLoading} disabled={!isValid} type="submit">
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
