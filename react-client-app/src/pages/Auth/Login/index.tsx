import { memo, FC, FormEvent} from "react";
import styles from "./index.module.scss"
import LoginForm from "@/components/Auth/LoginForm";

interface LoginProps {

}

const Login:FC<LoginProps> = () => {

  const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className={styles.Login}>
      <LoginForm
        btnText="Войти"
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default memo(Login);