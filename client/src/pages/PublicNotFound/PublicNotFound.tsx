import { Link } from 'react-router-dom'
import styles from './PublicNotFound.module.scss'
import { Btn, PublicRoutes } from '@/shared'


export const PublicNotFound = () => {
  return (
    <div className={styles.NotFound}>
      <div className={styles.container}>
        <p>Такой страницы не существует</p>
        <Link to={PublicRoutes.LOGIN}>
          <Btn>
            Страница входа
          </Btn>
        </Link>
      </div>
    </div>
  )
}