import { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
  isOpen: boolean;
  selector?: string;
}

export const Portal: React.FC<PortalProps> = ({ children, isOpen, selector = '#portal-root' }) => {
  const [el] = useState(document.createElement('div'));

  useEffect(() => {
    const body = document.body;

    if (isOpen) {
      body.style.overflow = 'hidden';
      const mount = document.querySelector(selector);
      if (mount) {
        mount.appendChild(el);
      }
    } else {
      body.style.overflow = '';
      const mount = document.querySelector(selector);
      if (mount) {
        mount.removeChild(el);
      }
    }

    return () => {
      body.style.overflow = '';
      const mount = document.querySelector(selector);
      if (mount) {
        mount.removeChild(el);
      }
    };
  }, [isOpen, el, selector]);

  return isOpen ? ReactDOM.createPortal(children, el) : null;
};

