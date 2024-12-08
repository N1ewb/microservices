import { useLocation, useNavigate } from "react-router-dom";
import { useRoomDetails } from "../../context/modalContexts/RoomDetailsContext";


export default function ViewRoomDetailsButton({ roomId, userId }) {
  const { handleToggleRoomDetailsModal } = useRoomDetails();
  const location = useLocation()
  const navigate = useNavigate();

  const handleClick = () => {
    handleToggleRoomDetailsModal()
    navigate(`${location.pathname}?roomId=${roomId}&userId=${userId}`);
  };

  return <button onClick={handleClick}>View Room</button>;
}
