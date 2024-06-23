import { FC, memo, useEffect, useRef, useState } from "react";
import styles from './ScrollContainer.module.scss'
import { CSSTransition } from "react-transition-group";
import ScrollBtn from "@/UI/ScrollBtn";

interface ScrollContainerProps{
  
}

const ScrollContainer:FC<ScrollContainerProps> = () => {
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
        <ScrollBtn
          onClick={scrollToTop}
        />
      </div>
    </CSSTransition>
  );
};

export default memo(ScrollContainer);