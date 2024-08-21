import { LoginForm } from '@/features'
import styles from './LoginWidget.module.scss'
import { ModalContainer } from '@/shared'
import { useLoginWidget } from '../model/useLoginWidget'

export const LoginWidget = () => {

  const {
    email,
    password,
    handleSubmit,
    isLoading,
    isActive,
    modal,
    hideModal
  } = useLoginWidget()

  return (
    <div className={styles.LoginWidget}>
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
  )
}