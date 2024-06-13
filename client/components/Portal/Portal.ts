import { FC, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
    children: ReactNode;
}

const Portal: FC<PortalProps> = ({ children }) => {
    const portalRoot = document.getElementById('portal-root');
    const elRef = useRef<HTMLDivElement | null>(null);

    if (!elRef.current) {
        elRef.current = document.createElement('div');
    }

    useEffect(() => {
        const currentEl = elRef.current;
        if (portalRoot && currentEl) {
            portalRoot.appendChild(currentEl);
        }
        return () => {
            if (portalRoot && currentEl) {
                portalRoot.removeChild(currentEl);
            }
        };
    }, [portalRoot]);

    return createPortal(children, elRef.current);
};

export default Portal;
