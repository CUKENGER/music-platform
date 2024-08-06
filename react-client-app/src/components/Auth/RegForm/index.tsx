import { memo, FC, FormEvent} from "react";
import styles from "./index.module.scss"
import LoginForm from "../LoginForm";
import InputString from "@/UI/InputString";
import { useInput } from "@/hooks/useInput";

interface RegFormProps {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
}

const RegForm:FC<RegFormProps> = ({handleSubmit}) => {

  const username = useInput('', {isEmpty: true})

  return (
    <LoginForm btnText="Зарегистрироваться" handleSubmit={handleSubmit} isLogin={false}>
      <InputString
        onChange={username.onChange}
        onBlur={username.onBlur}
        placeholder="Введите никнейм"
        value={username.value}
        isEmpty={username.isEmpty}
        setValue={username.setValue}
      />
    </LoginForm>
  );
};

export default memo(RegForm);