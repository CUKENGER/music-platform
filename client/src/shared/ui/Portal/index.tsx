import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: ReactNode;
  isOpen: boolean;
  selector?: string;
}

export const Portal: React.FC<PortalProps> = ({ children, isOpen, selector = '#portal-root' }) => {
  console.log('Portal: isOpen =', isOpen);

  if (!isOpen) {
    console.log('Portal: Not rendering, isOpen = false');
    return null;
  }

  const mount = document.querySelector(selector);
  if (!mount) {
    console.warn(`Portal: Element with selector ${selector} not found`);
    return null;
  }

  console.log('Portal: Rendering to', selector);
  return ReactDOM.createPortal(children, mount);
};
