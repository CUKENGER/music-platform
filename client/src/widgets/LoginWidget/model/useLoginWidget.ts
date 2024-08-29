import { useUserStore } from "@/entities";
import { useLoginUser } from "@/entities/user/api/useUserApi";
import { useModal, useInput, PrivateRoutes} from "@/shared";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
// import Cookies from "universal-cookie";

export const useLoginWidget = () => {
  const { hideModal, modal, showModal } = useModal();

  const { setIsAuth, setUser } = useUserStore();

  const {mutate: login, isPending: isLoading} = useLoginUser(showModal)

  const navigate = useNavigate();

  const email = useInput("", { isEmpty: true, isEmail: true, isLatin: true });
  const password = useInput("", {
    isEmpty: true,
    isPasswordStrong: true,
    isLatin: true,
  });

  const isActive = email.isEmpty || password.isEmpty;


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.isEmpty || password.isEmpty) {
      showModal("Заполните все данные, пожалуйста");
      return;
    }

    const userDto = {
      email: email.value,
      password: password.value,
    };

    login(userDto, {
      onSuccess: (data) => {
        console.log('login data', data)
        if (data.accessToken && data.refreshToken) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
  
          setIsAuth(true);
          setUser(userDto);
          navigate(PrivateRoutes.HOME);
        } else {
          console.error("Tokens were not provided");
          showModal("Вы не зарегистрированы");
        }
      }
    });
  };

  return {
    email,
    password,
    handleSubmit,
    isLoading,
    isActive,
    modal,
    hideModal,
  };
};
