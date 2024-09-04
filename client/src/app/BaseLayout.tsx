import { useAxiosInterceptor } from "@/shared";
import AppRouter from "./AppRouter";
import styles from './BaseLayout.module.scss';
import { useUserStore } from "@/entities";
import { Header, Navbar, Player } from "@/widgets";

function BaseLayout() {

  const { isAuth } = useUserStore();

  useAxiosInterceptor()

  console.log('isAuth', isAuth)

  return (
    <>
      {isAuth ? (
        <>
          <Header />
          <Navbar />
          <div className={styles.page_content}>
            <AppRouter />
          </div>

          <Player/>
        </>
      ) : (
        <AppRouter />
      )}
    </>
  );
}

export default BaseLayout;
