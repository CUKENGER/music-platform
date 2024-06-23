import { useState } from "react";

interface ModalState {
    isOpen: boolean;
    message: string;
    onClick?: () => void;
}

const useModal = () => {
    const [modal, setModal] = useState<ModalState>({ isOpen: false, message: '', onClick: () => {} });

    const showModal = (message: string, onClick?: () => void) => {
        setModal({ isOpen: true, message, onClick });
    };

    const hideModal = () => {
        setModal({ isOpen: false, message: '', onClick: () => {} });
    };

    return { modal, showModal, hideModal };
};

export default useModal;
