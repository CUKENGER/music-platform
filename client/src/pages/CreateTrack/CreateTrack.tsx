import { Btn, PrivateRoutes } from '@/shared'
import styles from './CreateTrack.module.scss'
import { Link } from 'react-router-dom'
import { CreateTrackForm } from '@/features'

export const CreateTrack = () => {

  return (
    <div className={styles.CreateTrack}>
      <div className={styles.btn_container}>
        <Link to={PrivateRoutes.TRACKS}>
          <Btn s={true}>
              Назад
          </Btn>
        </Link>
      </div>
      <CreateTrackForm/>
    </div>
  )
}