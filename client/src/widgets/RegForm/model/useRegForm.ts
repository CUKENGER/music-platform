import { handleAuthError, useCheckUsername, useRegUser } from '@/entities/user';
import { PUBLIC_ROUTES } from '@/shared/consts';
import { useInput, useModal } from '@/shared/hooks';
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRegWidget = () => {
  const { hideModal, modal, showModal } = useModal();

  const { mutate: regUser, isPending: isLoading } = useRegUser();
  const { mutate: checkUsername } = useCheckUsername();

  const navigate = useNavigate();

  const email = useInput('', { isEmpty: true, isEmail: true, isLatin: true });
  const password = useInput('', { isEmpty: true, isPasswordStrong: true, isLatin: true });
  const repeatPassword = useInput(
    '',
    { isEmpty: true, isPasswordStrong: true, isLatin: true },
    password.value,
  );
  const username = useInput('', { isEmpty: true, isLatin: true, isLength: { min: 3, max: 16 } });

  const conditions = [
    email.isEmpty,
    password.isEmpty,
    username.isEmpty,
    !email.isEmailValid,
    !username.isLengthValid,
    password.value !== repeatPassword.value,
    !email.isLatin,
    !password.isLatin,
    !username.isLatin,
    !password.isPasswordStrong,
  ];

  const isValid = conditions.some((condition) => condition);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValid) {
      showModal('Заполните все данные корректно, пожалуйста');
      return;
    }

    checkUsername(username.value, {
      onSuccess: () => {
        const userDto = {
          email: email.value,
          password: password.value,
          username: username.value,
        };

        regUser(userDto, {
          onSuccess: (response) => {
            console.log('Registration successful:', response);
            navigate(PUBLIC_ROUTES.ACTIVATION);
          },
          onError: (error) => {
            handleAuthError(error, showModal);
          },
        });
      },
      onError: (error) => {
        handleAuthError(error, showModal);
        showModal('Этот никнейм уже занят');
        console.error('Username check failed:', error);
      },
    });
  };

  return {
    email,
    password,
    username,
    handleSubmit,
    repeatPassword,
    isValid,
    isLoading,
    modal,
    hideModal,
  };
};
