import { Link } from 'react-router-dom'
import styles from './PrivateNotFound.module.scss'
import { PRIVATE_ROUTES } from '@/shared/consts'
import { Btn } from '@/shared/ui'

export const PrivateNotFound = () => {
  return (
    <div className={styles.NotFound}>
      <div className={styles.container}>
        <p>Такой страницы не существует</p>
        <Link to={PRIVATE_ROUTES.HOME}>
          <Btn>
            На главную
          </Btn>
        </Link>
      </div>
    </div>
  )
}
