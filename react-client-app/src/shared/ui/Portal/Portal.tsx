import { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
  isOpen: boolean; // Флаг для управления открытием/закрытием портала
  selector?: string; // Опциональный селектор, если требуется
}

const Portal: React.FC<PortalProps> = ({ children, isOpen, selector = '#portal-root' }) => {
  const [el] = useState(document.createElement('div')); // Используем useState для создания элемента

  useEffect(() => {
    const body = document.body;

    if (isOpen) {
      body.style.overflow = 'hidden'; // Скрыть скроллбар при открытии портала
      const mount = document.querySelector(selector);
      if (mount) {
        mount.appendChild(el);
      }
    } else {
      body.style.overflow = ''; // Восстановить скроллбар при закрытии портала
      const mount = document.querySelector(selector);
      if (mount) {
        mount.removeChild(el);
      }
    }

    return () => {
      body.style.overflow = ''; // Восстановить скроллбар при размонтировании портала
      const mount = document.querySelector(selector);
      if (mount) {
        mount.removeChild(el);
      }
    };
  }, [isOpen, el, selector]);

  return isOpen ? ReactDOM.createPortal(children, el) : null;
};

export default Portal;
