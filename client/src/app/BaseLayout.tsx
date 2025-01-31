import { IUser, useUserStore } from '@/entities/user';
import { useAxiosInterceptor } from '@/shared/api';
import { Header } from '@/widgets/Header';
import { Navbar } from '@/widgets/Navbar';
import { Player } from '@/widgets/Player';
import { useEffect } from 'react';
import AppRouter from './AppRouter';
import styles from './BaseLayout.module.scss';

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
  }, [user, setIsAdmin]);

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
