import { useUserStore } from '@/entities/user';
import { useAxiosInterceptor } from '@/shared/api';
import { Header } from '@/widgets/Header';
import { Navbar } from '@/widgets/Navbar';
import { Player } from '@/widgets/Player';
import { useMemo } from 'react';
import AppRouter from './AppRouter';
import styles from './BaseLayout.module.scss';

function BaseLayout() {
  const { isAuth, user, setIsAdmin } = useUserStore();

  const isAdmin = useMemo(() => {
    if (!user) return false;
    return user?.roles?.some((role) => role.role.value === 'ADMIN') ?? false;
  }, [user]);

  useMemo(() => {
    setIsAdmin(isAdmin);
  }, [isAdmin, setIsAdmin]);

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
