import { useState } from "react";
import { ModalState } from "../types/ModalState";

export const useModal = () => {
    const [modal, setModal] = useState<ModalState>({ isOpen: false, message: '', onClick: () => { } });

    const showModal = (message: string, onClick?: () => void) => {
        setModal({ isOpen: true, message, onClick });
    };

    const hideModal = () => {
        setModal({ isOpen: false, message: '', onClick: () => { } });
    };

    return { modal, showModal, hideModal };
};

