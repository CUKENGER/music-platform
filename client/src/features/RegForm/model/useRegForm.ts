import { useRegUser, useCheckUsername, handleAuthError } from '@/entities/user';
import { PUBLIC_ROUTES } from '@/shared/consts';
import { useModal } from '@/shared/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { registrationSchema } from './registrationSchema';

interface IRegForm {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export const useRegForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IRegForm>({
    resolver: yupResolver(registrationSchema),
    mode: 'onChange',
  });

  const { hideModal, modal, showModal } = useModal();
  const { mutate: regUser, isPending: isLoading } = useRegUser();
  const { mutate: checkUsername } = useCheckUsername();
  const navigate = useNavigate();

  const handleFormSubmit = async (data: IRegForm) => {
    const { email, password, username } = data;

    checkUsername(username, {
      onSuccess: () => {
        regUser(
          { email, password, username },
          {
            onSuccess: (response) => {
              console.log('Registration successful:', response.message);
              navigate(PUBLIC_ROUTES.ACTIVATION + `/${email}`);
            },
            onError: (error) => {
              handleAuthError(error, showModal);
            },
          },
        );
      },
      onError: (error) => {
        handleAuthError(error, showModal);
        showModal('Этот никнейм уже занят');
        console.error('Username check failed:', error);
      },
    });
  };

  const onSubmit: SubmitHandler<IRegForm> = (data) => {
    handleFormSubmit(data);
  };

  return {
    handleSubmit : handleSubmit(onSubmit),
    control,
    errors,
    isLoading,
    isValid,
    modal,
    hideModal,
  };
};
