import { useAxiosInterceptor } from "@/shared";
import AppRouter from "./AppRouter";
import styles from './BaseLayout.module.scss';
import { IUser, usePlayerStore, useUserStore } from "@/entities";
import { Header, Navbar, Player } from "@/widgets";
import { useEffect } from "react";

function BaseLayout() {
  const { isAuth, user, setIsAdmin } = useUserStore();
  const activeTrack = usePlayerStore(state => state.activeTrack)

  function isUserAdmin(user: IUser | null): boolean {
    if (!user) return false;
    return user?.roles?.some(role => role.role.value === 'ADMIN') ?? false;
  }

  useEffect(() => {
    if (user) {
      const isAdmin = isUserAdmin(user);
      setIsAdmin(isAdmin)
    }
  }, [user])

  useAxiosInterceptor()

  return (
    <>
      {isAuth ? (
        <>
          <Header />
          <Navbar />
          <div className={styles.pageContent}>
            <AppRouter />
          </div>
          {activeTrack?.audio && (
            <Player audioUrl={activeTrack?.audio}/>
          )}
          
        </>
      ) : (
        <AppRouter />
      )}
    </>
  );
}

export default BaseLayout;
