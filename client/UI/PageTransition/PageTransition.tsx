// components/PageTransition.tsx
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './PageTransition.module.css';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [inProp, setInProp] = useState(false);

  useEffect(() => {
    setInProp(true);
  }, [router.pathname]);

  return (
    <TransitionGroup>
      <CSSTransition
        key={router.pathname}
        timeout={300}
        classNames={{
          enter: styles.page_enter,
          enterActive: styles.page_enter_active,
          exit: styles.page_exit,
          exitActive: styles.page_exit_active,
        }}
        in={inProp}
        unmountOnExit
        onExited={() => setInProp(false)}
      >
        <div className={styles.page}>
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;
