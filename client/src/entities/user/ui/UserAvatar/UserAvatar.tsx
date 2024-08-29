import { FC } from 'react';
import styles from './UserAvatar.module.scss'
import { Menu, MenuItem, PrivateRoutes} from '@/shared';
import { useGetByToken, useLogoutUser } from '../../api/useUserApi';
import { useNavigate } from 'react-router-dom';

const UserAvatar: FC = () => {
  const navigate = useNavigate()

  const { mutate: logout } = useLogoutUser()

  const handleClick = () => {
    logout();
  };

  const items: MenuItem[] = [
    {text: 'Профиль', onClick: () => navigate(PrivateRoutes.PROFILE)},
    {text: 'Выйти', onClick: handleClick},
  ]

  const {data: user} = useGetByToken()

  return (

    <div className={styles.user_container}>
      <div className={styles.main_container}>
        <div className={styles.user_avatar}>
        </div>
        <div className={styles.name_container}>
          <p>{user?.username}</p>
        </div>
      </div>
      <Menu items={items}/>
    </div>
  );
}

export default UserAvatar;
