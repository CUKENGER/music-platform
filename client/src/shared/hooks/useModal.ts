import { useState } from "react";
import { ModalState } from "../types/ModalState";

export const useModal = () => {
  const [modal, setModal] = useState<ModalState>({ isOpen: false, text: '', onClick: () => { } });

  const showModal = (text: string, onClick?: () => void) => {
    setModal({ isOpen: true, text, onClick });
  };

  const hideModal = () => {
    setModal({ isOpen: false, text: '', onClick: () => { } });
  };

  return { modal, showModal, hideModal };
};

