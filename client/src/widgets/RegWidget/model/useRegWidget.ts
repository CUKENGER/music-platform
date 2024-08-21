import { handleAuthError } from "@/entities";
import { useCheckUsername, useRegUser } from "@/entities/user/api/useUserApi";
import { useModal, useInput } from "@/shared";
import { PublicRoutes } from "@/shared/consts/routes";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export const useRegWidget = () => {
  const { hideModal, modal, showModal } = useModal();

  const { mutate: regUser, isPending: isLoading } = useRegUser();
  const { mutate: checkUsername, data: isUsernameValid } = useCheckUsername();

  const navigate = useNavigate();

  const email = useInput('', { isEmpty: true, isEmail: true, isLatin: true });
  const password = useInput('', { isEmpty: true, isPasswordStrong: true, isLatin: true });
  const repeatPassword = useInput('', { isEmpty: true, isPasswordStrong: true, isLatin: true }, password.value);
  const username = useInput('', { isEmpty: true, isLatin: true, isLength: { min: 3, max: 16 } });

  const isValid = email.isEmpty || password.isEmpty || username.isEmpty || !email.isEmailValid || !username.isLengthValid || password.value !== repeatPassword.value;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValid) {
      showModal('Заполните все данные корректно, пожалуйста');
      return;
    }

    checkUsername(username.value, {
      onSuccess: () => {
        if (isUsernameValid) {
          showModal('Этот никнейм уже занят');
          return;
        }

        const userDto = {
          email: email.value,
          password: password.value,
          username: username.value,
        };

        regUser(userDto, {
          onSuccess: (response) => {
            console.log('Registration successful:', response);
            navigate(PublicRoutes.ACTIVATION);
          },
          onError: (error) => {
            handleAuthError(error, showModal);
          }
        });
      },
      onError: (error) => {
        handleAuthError(error, showModal);
        console.error('Username check failed:', error);
      }
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
    hideModal
  };
};
