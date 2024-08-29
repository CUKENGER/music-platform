import AppRouter from "./AppRouter";
import styles from './BaseLayout.module.scss';
import { useUserStore } from "@/entities";
import { Header, Navbar } from "@/widgets";
import { useAxiosInterceptor } from "@/shared/api/axiosInstance";

function BaseLayout() {

  const { isAuth } = useUserStore();

  useAxiosInterceptor()

  return (
    <>
      {isAuth ? (
        <>
          <Header />
          <Navbar />
          <div className={styles.page_content}>
            <AppRouter />
          </div>
        </>
      ) : (
        <AppRouter />
      )}
    </>
  );
}

export default BaseLayout;
