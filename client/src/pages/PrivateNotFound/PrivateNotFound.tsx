import { Link } from 'react-router-dom'
import styles from './PrivateNotFound.module.scss'
import { Btn, PrivateRoutes } from '@/shared'

export const PrivateNotFound = () => {
  return (
    <div className={styles.NotFound}>
      <div className={styles.container}>
        <p>Такой страницы не существует</p>
        <Link to={PrivateRoutes.HOME}>
          <Btn>
            На главную
          </Btn>
        </Link>
      </div>
    </div>
  )
}