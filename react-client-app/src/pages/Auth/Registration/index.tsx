import { memo, FC, FormEvent } from "react";
import styles from "./index.module.scss";
import RegForm from "@/components/Auth/RegForm";
import { useInput } from "@/hooks/useInput";
import useModal from "@/hooks/useModal";
import { useRegUserMutation } from "@/api/Auth/AuthService";
import ModalContainer from "@/UI/ModalContainer";
import { useNavigate } from "react-router-dom";
import { PublicRoutes } from "@/routes/routes";

export interface ResError extends Error {
  status?: number;
}

interface RegistrationProps {}

const Registration: FC<RegistrationProps> = () => {
  const { hideModal, modal, showModal } = useModal();
  const [regUser, {isLoading}] = useRegUserMutation();

  const navigate = useNavigate()

  const email = useInput('', { isEmpty: true, isEmail: true, isLatin: true });
  const password = useInput('', { isEmpty: true, isPasswordStrong: true, isLatin: true });
  const repeatPassword = useInput('', { isEmpty: true, isPasswordStrong: true, isLatin: true }, password.value);
  const username = useInput('', { isEmpty: true, isLatin: true, isLength: { min: 3, max: 16 } });

  const isValid = email.isEmpty || password.isEmpty || username.isEmpty || !email.isEmailValid || !username.isLengthValid

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValid) {
      showModal('Заполните все данные корректно, пожалуйста');
      return;
    }

    const userDto = {
      email: email.value,
      password: password.value,
      username: username.value,
    };

    try {
      await regUser(userDto).unwrap()
      navigate(PublicRoutes.ACTIVATION)
    } catch (err: unknown) {
      const errorResponse = err as ResError;
      if (errorResponse.status === 400) {
        showModal('Пользователь с такой почтой уже зарегистрирован');
      } else if (errorResponse.status === 401) {
        showModal('У вас нет прав для этого действия');
      } else if (errorResponse.status === 500) {
        showModal('Произошла ошибка на сервере, подождите пожалуйста');
      } else {
        showModal('Произошла ошибка, попробуйте позже');
      }
    }
  };

  return (
    <div className={styles.Registration}>
      <RegForm
        email={email}
        password={password}
        username={username}
        handleSubmit={handleSubmit}
        repeatPassword={repeatPassword}
        isValid={isValid}
        isLoading={isLoading}
      />
      {modal.isOpen && (
        <ModalContainer 
          text={modal.message}
          hideModal={hideModal} 
          onClick={modal.onClick}
        />
      )}
    </div>
  );
};

export default memo(Registration);
