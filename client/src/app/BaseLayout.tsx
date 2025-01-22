import { IUser, useUserStore } from '@/entities/user';
import AppRouter from './AppRouter';
import styles from './BaseLayout.module.scss';
import { Header, Navbar, Player } from '@/widgets';
import { useEffect } from 'react';
import { useAxiosInterceptor } from '@/shared/api';

function BaseLayout() {
  const { isAuth, user, setIsAdmin } = useUserStore();

  function isUserAdmin(user: IUser | null): boolean {
    if (!user) return false;
    return user?.roles?.some((role) => role.role.value === 'ADMIN') ?? false;
  }

  useEffect(() => {
    if (user) {
      const isAdmin = isUserAdmin(user);
      setIsAdmin(isAdmin);
    }
  }, [user]);

  useAxiosInterceptor();

  return (
    <>
      {isAuth ?
        <>
          <Header />
          <Navbar />
          <div className={styles.pageContent}>
            <AppRouter />
          </div>
          <Player />
        </>
      : <AppRouter />}
    </>
  );
}

export default BaseLayout;
