import { Btn, PrivateRoutes } from '@/shared'
import { Link } from 'react-router-dom'
import { CreateTrackForm } from '@/features'

export const CreateTrack = () => {

  return (
    <div>
      <div>
        <Link to={PrivateRoutes.TRACKS}>
          <Btn small={true}>
              Назад
          </Btn>
        </Link>
      </div>
      <CreateTrackForm/>
    </div>
  )
}