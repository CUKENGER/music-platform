import AppRouter from "./AppRouter";
import styles from './BaseLayout.module.scss';
import { useUserStore } from "@/entities";
import { useEffect } from "react";
import { axiosInstance, PublicRoutes } from "@/shared";
import { useNavigate } from "react-router-dom";
import { Header, Navbar } from "@/widgets";
import { useAxiosInterceptor } from "@/shared/api/axiosInstance";

function BaseLayout() {

  const navigate = useNavigate();
  const { isAuth, setIsAuth } = useUserStore();

  useAxiosInterceptor()

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     axiosInstance.get('/auth/validateToken', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     }).then(() => {
  //       setIsAuth(true);
  //     }).catch(() => {
  //       localStorage.removeItem('token');
  //       setIsAuth(false);
  //       navigate(PublicRoutes.LOGIN);
  //     });
  //     console.log('validateToken')
  //   } else {
  //     setIsAuth(false);
  //   }
  // }, [setIsAuth, navigate]);

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
        </>
      ) : (
        <AppRouter />
      )}
    </>
  );
}

export default BaseLayout;
