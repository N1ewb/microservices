import React, { createContext, useContext, useState } from "react";

export const RoomDetailsContext = createContext();

export function useRoomDetails() {
  return useContext(RoomDetailsContext);
}

export const RoomDetailsProvider = ({ children }) => {
  const [openRoomDetailsModal, setOpenRoomDetailsModal] = useState(false);

  const handleToggleRoomDetailsModal = () => {
    setOpenRoomDetailsModal((prev) => !prev);
  };

  return (
    <RoomDetailsContext.Provider
      value={{ openRoomDetailsModal, handleToggleRoomDetailsModal }}
    >
      {children}
    </RoomDetailsContext.Provider>
  );
};
