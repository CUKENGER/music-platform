import { useUserStore } from '@/entities/user';
import { useAxiosInterceptor } from '@/shared/api';
import { Header } from '@/widgets/Header';
import { Navbar } from '@/widgets/Navbar';
import { Player } from '@/widgets/Player';
import AppRouter from './AppRouter';
import styles from './BaseLayout.module.scss';

function BaseLayout() {
  const { isAuth } = useUserStore();

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
