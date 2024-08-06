import { memo, FC, FormEvent} from "react";
import styles from "./index.module.scss"
import RegForm from "@/components/Auth/RegForm";

interface RegistrationProps {

}

const Registration:FC<RegistrationProps> = () => {

  const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className={styles.Registration}>
      <RegForm
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default memo(Registration);