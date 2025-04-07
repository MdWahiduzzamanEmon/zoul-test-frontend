import React, { useContext, useState } from "react";
import { createContext } from "react";

const initContext = {
  modal: null,
  setModal: () => {},
};

const ModalContext = createContext(initContext);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({ modal: null, props: {} });

  const actions = {
    modal,
    setModal,
  };

  return (
    <ModalContext.Provider value={actions}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const { modal, setModal } = useContext(ModalContext);

  return {
    modal,
    show: (component, props) =>
      setModal({
        modal: component,
        props,
      }),
    close: () =>
      setModal({
        modal: null,
        props: {},
      }),
  };
};
