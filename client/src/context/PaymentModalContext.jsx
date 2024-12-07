import React, { createContext, useContext, useState } from "react";

export const ModalContext = createContext();

export function useModal() {
  return useContext(ModalContext);
}

export const ModalProvider = ({ children }) => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  
  const handleTogglePaymentModal = () => {
    setOpenPaymentModal(prev => !prev);
  };

  return (
    <ModalContext.Provider value={{ openPaymentModal, handleTogglePaymentModal }}>
      {children}
    </ModalContext.Provider>
  );
};
