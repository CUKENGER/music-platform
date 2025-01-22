import { CreateTrackForm } from '@/features/CreateTrackForm';
import { PRIVATE_ROUTES } from '@/shared/consts';
import { Btn } from '@/shared/ui';
import { Link } from 'react-router-dom';

export const CreateTrack = () => {
  return (
    <div>
      <div>
        <Link to={PRIVATE_ROUTES.TRACKS}>
          <Btn small={true}>Назад</Btn>
        </Link>
      </div>
      <CreateTrackForm />
    </div>
  );
};
