import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../../context/modalContexts/PaymentModalContext";

export default function BookRoomButton({ roomId, userId }) {
  const { handleTogglePaymentModal } = useModal();
  const location = useLocation()
  const navigate = useNavigate();

  const handleClick = () => {
    handleTogglePaymentModal();
    
    navigate(`${location.pathname}?roomId=${roomId}&userId=${userId}`);
  };

  return <button onClick={handleClick}>Book</button>;
}
