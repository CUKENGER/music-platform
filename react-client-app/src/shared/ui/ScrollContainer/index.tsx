import { memo, useEffect, useRef, useState } from "react";
import styles from './ScrollContainer.module.scss'
import { CSSTransition } from "react-transition-group";
import arrowUp from '@/assets/scrollUp.svg'

const ScrollContainer = () => {
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);
  const scrollBtnRef = useRef(null)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
  
  return (
    <CSSTransition
      in={showScrollButton}
      nodeRef={scrollBtnRef}
      timeout={200}
      classNames={{
        enter: styles.scrollButton_enter,
        enterActive: styles.scrollButton_enter_active,
        exit: styles.scrollButton_exit,
        exitActive: styles.scrollButton_exit_active,
      }}
      unmountOnExit
    >
      <div ref={scrollBtnRef}>
        <div className={styles.scrollButton} onClick={scrollToTop}>
          <div className={styles.arrow_container}>
            <img
              className={styles.arrowUp}
              src={arrowUp}
              alt="button up icon"
            />
          </div>
      </div>
      </div>
    </CSSTransition>
  );
};

export default memo(ScrollContainer);