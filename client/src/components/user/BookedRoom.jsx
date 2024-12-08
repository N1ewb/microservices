import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/modalContexts/PaymentModalContext";
import { useCheckin } from "../../context/modalContexts/ConfirmCheckInContext";
import { getReservedRooms } from "../../../actions/user.actions";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookedRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleTogglePaymentModal } = useModal();
  const { handleToggleCheckinModal } = useCheckin();
  const [reservedRoom, setreservedRoom] = useState([]);

  const handleClick = (room) => {
    handleToggleCheckinModal();
    navigate(`${location.pathname}?reservation_id=${room.reservation_id}`);
  };

  const handleClickPayment = (room) => {
    handleTogglePaymentModal();
    navigate(`${location.pathname}?userId=${user.id}&roomId=${room.room_id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const response = await getReservedRooms(user);
        if (response.status) {
          setreservedRoom(response.rooms);
        }
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="p-6 max-h-[800px] bg-gray-100 w-full">
      <h2 className="text-2xl font-semibold mb-6">Your Booked Rooms</h2>
      {reservedRoom && reservedRoom.length > 0 ? (
        <div className="flex gap-4 w-full overflow-x-auto pb-7">
          {reservedRoom.map((room) => (
            <div
              key={room.id}
              className="bg-white min-w-[33%] shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={`http://localhost:5001/server${room.image_path}`}
                alt={room.type}
                className="w-full h-48 object-cover"
              />
              <div className="flex w-full justify-between items-end">
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {room.type}
                  </h3>
                  <p className="text-gray-600 mt-2">Price: ${room.price}</p>
                  <p className="text-gray-600 mt-2">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        room.status === "booked"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {room.status}
                    </span>
                  </p>
                </div>
                <div className="checkout w-1/2 p-5 flex justify-end">
                  {room.status === "reserved" ? (
                    <button
                      onClick={() => handleClick(room)}
                      className="bg-blue-500 rounded-md text-white px-5 py-2"
                    >
                      Checkin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClickPayment(room)}
                      className="bg-blue-500 rounded-md text-white px-5 py-2"
                    >
                      Checkout
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">No booked rooms yet</p>
      )}
    </div>
  );
}
