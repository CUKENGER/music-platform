import { useLoginUser, useUserStore } from '@/entities/user';
import { PRIVATE_ROUTES } from '@/shared/consts';
import { useInput, useModal } from '@/shared/hooks';
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export const useLoginWidget = () => {
  const { hideModal, modal, showModal } = useModal();

  const { setIsAuth, setUser } = useUserStore();

  const { mutate: login, isPending: isLoading } = useLoginUser(showModal);

  const navigate = useNavigate();

  const email = useInput('', { isEmpty: true, isEmail: true, isLatin: true });
  const password = useInput('', {
    isEmpty: true,
    isPasswordStrong: true,
    isLatin: true,
  });

  const isValid = email.isEmpty || password.isEmpty;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      showModal('Заполните все данные, пожалуйста');
      return;
    }

    const userDto = {
      email: email.value,
      password: password.value,
    };

    login(userDto, {
      onSuccess: (data) => {
        if (data.accessToken && data.refreshToken) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          setIsAuth(true);
          setUser(userDto);
          navigate(PRIVATE_ROUTES.HOME);
        } else {
          console.error('Tokens were not provided');
          showModal('Вы не зарегистрированы');
        }
      },
    });
  };

  return {
    email,
    password,
    handleSubmit,
    isLoading,
    isValid,
    modal,
    hideModal,
  };
};
