import styles from './UserAvatar.module.scss';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../model/userStore';
import { useGetByToken, useLogoutUser } from '../../api/useUserApi';
import { MenuItem } from '@/shared/types';
import { useCallback, useEffect } from 'react';
import { Menu } from '@/shared/ui';

export const UserAvatar: FC = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuth } = useUserStore();
  const { mutate: logout } = useLogoutUser();

  const handleLogout = useCallback(() => {
    logout();
    setIsAuth(false);
    navigate(PublicRoutes.LOGIN);
  }, [logout, navigate, setIsAuth]);

  const items: MenuItem[] = [
    { text: 'Профиль', onClick: () => navigate(PrivateRoutes.PROFILE) },
    { text: 'Выйти', onClick: handleLogout },
  ];

  const { data: user, isLoading, error } = useGetByToken();

  useEffect(() => {
    if (error) {
      handleLogout();
    }
  }, [error, handleLogout]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return (
    <div className={styles.user_container}>
      <div className={styles.main_container}>
        <div className={styles.user_avatar}></div>
        <div className={styles.name_container}>
          <p>{isLoading ? 'Loading...' : user?.username}</p>
        </div>
        <div className={styles.menu}>
          <Menu items={items} />
        </div>
      </div>
    </div>
  );
};
