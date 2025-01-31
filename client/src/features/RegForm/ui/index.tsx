import { Controller } from 'react-hook-form';
import { LoginLayout } from '@/entities/user';
import { PUBLIC_ROUTES } from '@/shared/consts';
import { Btn, ModalContainer, UIPasswordInput, UITextField } from '@/shared/ui';
import { Link } from 'react-router-dom';
import cl from './index.module.scss';
import { useRegForm } from '../model/useRegForm';

export const RegForm = () => {
  const { handleSubmit, control, errors, isLoading, isValid, modal, hideModal } = useRegForm();

  return (
    <>
      <LoginLayout handleSubmit={handleSubmit} title="Регистрация">
        <Controller
          name="username"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <UITextField
              {...field}
              name="username"
              label="Введите никнейм"
              required
              aria-invalid={!!errors.username}
              warnings={[{ condition: !!errors.username, text: errors.username?.message }]}
              clearable
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <UITextField
              {...field}
              name="email"
              type="email"
              label="Введите email"
              required
              warnings={[{ condition: !!errors.email, text: errors.email?.message}]}
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
              warnings={[{ condition: !!errors.password, text: errors.password?.message }]}
              clearable
            />
          )}
        />
        <Controller
          name="repeatPassword"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <UIPasswordInput
              {...field}
              name="repeatPassword"
              label="Повторите пароль"
              required
              aria-invalid={!!errors.repeatPassword}
              warnings={[
                {
                  condition: !!errors.repeatPassword,
                  text: errors.repeatPassword?.message,
                },
              ]}
              clearable
            />
          )}
        />
        <Btn isLoading={isLoading} disabled={!isValid} type="submit">
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
