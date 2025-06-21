import { useLoginUser, useUserStore } from '@/entities/user';
import { handleLoginErrorHandler } from '@/entities/user/model/handleLoginError';
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/shared/consts';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from './loginSchema';
import { useModal } from '@/shared/hooks';

interface ILoginForm {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginForm>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });
  const { hideModal, modal, showModal } = useModal();

  const { setIsAuth, setUser } = useUserStore();

  const { mutate: login, isPending: isLoading } = useLoginUser(showModal);

  const navigate = useNavigate();

  const handleFormSubmit = async (data: ILoginForm) => {
    const { email, password } = data;

    login(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.accessToken && data.refreshToken) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            setIsAuth(true);
            setUser({ email });
            navigate(PRIVATE_ROUTES.HOME);
          } else {
            console.error('Tokens were not provided');
            showModal('Ошибка входа', () => navigate(PUBLIC_ROUTES.REGISTRATION));
          }
        },
        onError: (error) => {
          handleLoginErrorHandler(error, showModal);
        },
      },
    );
  };

  const onSubmit: SubmitHandler<ILoginForm> = (data) => {
    handleFormSubmit(data);
  };

  return {
    handleSubmit: handleSubmit(onSubmit),
    isLoading,
    isValid,
    modal,
    hideModal,
    control,
    errors,
  };
};
