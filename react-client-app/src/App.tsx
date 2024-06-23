import { useEffect, useRef, useState } from 'react'
import styles from './App.module.scss'
import AppRouter from './AppRouter'
import Header from './components/Header'
import Navbar from './components/Navbar'
import Player from './components/Player'
import Loader from './UI/Loader'
import { CSSTransition } from 'react-transition-group'
import ScrollBtn from './UI/ScrollBtn'
import ScrollContainer from './components/ScrollContainer'

function App() {

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
      
        {/* <PlayerDetailed /> */}
      
    </>
  )
}

export default App
