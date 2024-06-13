import dynamic from 'next/dynamic';
import React, { ReactNode, useEffect, useState } from 'react';
import Head from "next/head";
import styles from '@/styles/Layout.module.css';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import Image from 'next/image';
import arrowUp from '@/assets/arrowUp.png';
import Loader from '@/components/Loader/Loader';
import PageTransition from '@/UI/PageTransition/PageTransition';
import { CSSTransition } from 'react-transition-group';
import { useRouter } from 'next/router';
import useWindowWidth from '@/hooks/useWindowWidth';
import PlayerMobileDetailed from '@/components/Player/PlayerMobileDetailed/PlayerMobileDetailed';


const Header = dynamic(() => import('@/components/Header/Header'), {
  loading: () => <Loader />,
});
const Player = dynamic(() => import('@/components/Player/Player/Player'), {
  loading: () => <Loader />,
});
const PlayerMobile = dynamic(() => import('@/components/Player/PlayerMobile/PlayerMobile'), {
  loading: () => <Loader />,
});
const PlayerDetailed = dynamic(() => import('@/components/Player/PlayerDetailed/PlayerDetailed'), {
  loading: () => <Loader />,
});

interface MainLayoutProps {
  title_text?: string;
  title?: string;
  description?: string;
  keywords?: string;
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  title,
  description,
  keywords,
  children,
  title_text,
}) => {
  const router = useRouter()
  const windowWidth = useWindowWidth()
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  const { pause, isOpenPlayerDetailed, isOpenPlayerMobileDetailed } = useTypedSelector(state => state.playerReducer);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleStop = () => setIsLoading(false);

    // Добавление слушателей событий маршрутизации
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      // Удаление слушателей при размонтировании компонента
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const body = document.body;
    if (isOpenPlayerDetailed) {
      body.classList.add(styles.noscroll);
    } else {
      body.classList.remove(styles.noscroll);
    }

    return () => {
      body.classList.remove(styles.noscroll);
    };
  }, [isOpenPlayerDetailed]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Head>
        <title>{title || 'Музыкальная площадка'}</title>
        <meta
          name="description"
          content={`Музыкальная площадка. Здесь каждый может оставить свой трек и стать знаменитым.` + description}
        />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={keywords || "Музыка, треки, артисты"} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {pause ? <link rel="shortcut icon" href="pause.ico" /> : <link rel="shortcut icon" href="play.ico" />}
      </Head>

      <Header title={title_text} />
      
      <PageTransition>
        <main>
          <div className={styles.wrapper}>{children}</div>
        </main>
      </PageTransition>
      
      <footer>
        {windowWidth > 860 
        ? (
          <Player/>
        )
        : (
          <PlayerMobile/>
        )
        }
        
      </footer>
      <CSSTransition
        in={showScrollButton && !isOpenPlayerDetailed}
        timeout={200}
        classNames={{
          enter: styles.scrollButton_enter,
          enterActive: styles.scrollButton_enter_active,
          exit: styles.scrollButton_exit,
          exitActive: styles.scrollButton_exit_active,
        }}
        unmountOnExit
      >
        <button className={styles.scrollButton} 
        onClick={scrollToTop}>
          <Image 
            className={styles.arrowUp} 
            src={arrowUp} 
            alt="button up icon" 
            loading='eager' 
          />
        </button>
      </CSSTransition>
      <CSSTransition
          in={isOpenPlayerDetailed}
          timeout={500}
          classNames={{
            enter: styles.page_enter,
            enterActive: styles.page_enter_active,
            exit: styles.page_exit,
            exitActive: styles.page_exit_active,
          }}
          unmountOnExit
        >
          <PlayerDetailed />
      </CSSTransition>
      <CSSTransition
          in={isOpenPlayerMobileDetailed}
          timeout={500}
          classNames={{
            enter: styles.page_enter,
            enterActive: styles.page_enter_active,
            exit: styles.page_exit,
            exitActive: styles.page_exit_active,
          }}
          unmountOnExit
        >
          <PlayerMobileDetailed />
      </CSSTransition>
    </>

  );
};

export default MainLayout;
