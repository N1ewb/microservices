import React, { createContext, useContext, useState } from "react";

export const CheckinContext = createContext();

export function useCheckin() {
  return useContext(CheckinContext);
}

export const CheckinProvider = ({ children }) => {
  const [openCheckinModal, setOpenCheckinModal] = useState(false);

  const handleToggleCheckinModal = () => {
    setOpenCheckinModal((prev) => !prev);
  };

  return (
    <CheckinContext.Provider
      value={{ openCheckinModal, handleToggleCheckinModal }}
    >
      {children}
    </CheckinContext.Provider>
  );
};
