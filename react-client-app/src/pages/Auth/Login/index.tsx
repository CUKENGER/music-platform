import { memo, FC, FormEvent} from "react";
import styles from "./index.module.scss"
import LoginForm from "@/components/Auth/LoginForm";
import { useInput } from "@/hooks/useInput";
import useModal from "@/hooks/useModal";
import ModalContainer from "@/UI/ModalContainer";
import { useLoginMutation } from "@/api/Auth/AuthService";
import { useNavigate } from "react-router-dom";
import useActions from "@/hooks/useActions";

interface LoginProps {

}

const Login:FC<LoginProps> = () => {
  const {hideModal, modal, showModal} = useModal()

  const [login, {isLoading}] = useLoginMutation()
  const {setAuth} = useActions()

  const navigate = useNavigate()

  const email = useInput('', {isEmpty: true, isEmail: true, isLatin: true})
  const password = useInput('', {isEmpty: true, isPasswordStrong: true, isLatin: true})

  const isActive = email.isEmpty || password.isEmpty

  const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(email.isEmpty || password.isEmpty) {
      showModal('Заполните все данные, пожалуйста')
      return
    }

    const userDto = {
      email: email.value,
      password: password.value
    }

    try {
      await login(userDto).unwrap()
        .then(() => {
          setAuth(true)
          navigate('/')
        })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(e:any) {
      showModal(`Произошла ошибка, повторите запрос ${e.status} - ${e.data.message}`)
      console.error(e);
    }
  }

  return (
    <div className={styles.Login}>
      <LoginForm
        email={email}
        password={password}
        btnText="Войти"
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isActiveBtn={isActive}
      />
      {modal.isOpen && (
        <ModalContainer
        hideModal={hideModal}
        text={modal.message}
        onClick={modal.onClick}
      />
      )}
      

    </div>
  );
};

export default memo(Login);