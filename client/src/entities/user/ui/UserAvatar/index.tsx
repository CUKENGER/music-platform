import styles from './UserAvatar.module.scss';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../model/userStore';
import { useGetByToken, useLogoutUser } from '../../api/useUserApi';
import { MenuItem } from '@/shared/types';
import { PUBLIC_ROUTES, PRIVATE_ROUTES } from '@/shared/consts';
import { Menu } from '@/shared/ui';
import { useCallback, useEffect } from 'react';

export const UserAvatar = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuth } = useUserStore();
  const { mutate: logout } = useLogoutUser();

  const handleLogout = useCallback(() => {
    logout();
    setIsAuth(false);
    navigate(PUBLIC_ROUTES.LOGIN);
  }, [logout, navigate, setIsAuth]);

  const { data: user, isLoading, error } = useGetByToken();

  const items: MenuItem[] = [
    { text: 'Профиль', onClick: () => navigate(PRIVATE_ROUTES.PROFILE + `/${user?.id}`) },
    { text: 'Выйти', onClick: handleLogout },
  ];

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
          <p onClick={() => navigate(PRIVATE_ROUTES.PROFILE + `/${user?.id}`)}>{isLoading ? 'Loading...' : user?.username}</p>
        </div>
        <div className={styles.menu}>
          <Menu items={items} />
        </div>
      </div>
    </div>
  );
};
