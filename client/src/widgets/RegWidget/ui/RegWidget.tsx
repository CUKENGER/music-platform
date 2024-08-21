import { RegForm } from '@/features'
import styles from './RegWidget.module.scss'
import { ModalContainer} from '@/shared'
import { useRegWidget } from '../model/useRegWidget';

export interface ResError extends Error {
  status?: number;
}

export const RegWidget = () => {

  const {
    email,
    password,
    username,
    handleSubmit,
    repeatPassword,
    isValid,
    isLoading,
    modal,
    hideModal
  } = useRegWidget()


  return (
    <div className={styles.RegWidget}>
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
  )
}