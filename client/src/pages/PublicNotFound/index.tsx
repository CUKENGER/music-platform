import { Link } from 'react-router-dom'
import styles from './PublicNotFound.module.scss'
import { PUBLIC_ROUTES } from '@/shared/consts'
import { Btn } from '@/shared/ui'

export const PublicNotFound = () => {
  return (
    <div className={styles.NotFound}>
      <div className={styles.container}>
        <p>Такой страницы не существует</p>
        <Link to={PUBLIC_ROUTES.LOGIN}>
          <Btn>
            Страница входа
          </Btn>
        </Link>
      </div>
    </div>
  )
}
