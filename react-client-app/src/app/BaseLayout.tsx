import Loader from "@/shared/ui/Loader/Loader";
import ScrollContainer from "@/shared/ui/ScrollContainer";
import Header from "@/widgets/Header/Header";
import Navbar from "@/widgets/Navbar";
import Player from "@/widgets/Player/ui/Player";
import { useEffect, useState } from "react";
import AppRouter from "./AppRouter";
import styles from './BaseLayout.module.scss';


function BaseLayout() {

  const [isLoading, setIsLoading] = useState(true)
  // const navigate = useNavigate()

  // const {isAuth} = useTypedSelector((state) => state.authReducer)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   if (!isAuth) {
  //     navigate('/login')
  //   }
  // }, [isAuth])

  if (isLoading) return (
    <div className={styles.loader_container}>
      <Loader />
    </div>
  )

  return (
    <>
    <div className={styles.header_container}>
          <Header />
    </div>
        <Navbar />

        <div className={styles.container}>
          <AppRouter />
        </div>
        
        <Player />
        
        <ScrollContainer />
    {/* {isAuth 
    ? (
      <>
        <div className={styles.header_container}>
          <Header />
        </div>
        <Navbar />

        <div className={styles.container}>
          <AppRouter />
        </div>
        
        <Player />
        
        <ScrollContainer />
      </>
    ) 
    : (
      <AppRouter/>
    )
    } */}
      
      
    </>
  )
}

export default BaseLayout
