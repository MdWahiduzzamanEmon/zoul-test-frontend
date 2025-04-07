import React from "react";
import { useModal } from "../context/ModalContext";

export const ModalManager = () => {
  const { modal, close } = useModal();

  if (!modal.modal) return null;

  const { modal: ModalComponent, props } = modal;

  return <ModalComponent onClose={close} {...props} />;
};
