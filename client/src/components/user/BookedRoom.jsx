import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getBookedRooms } from "../../../actions/user.actions";

export default function BookedRoom() {
  const { user } = useAuth();
  const [bookedRooms, setBookedRooms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const data = await getBookedRooms(user);
        setBookedRooms(data);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="p-6 max-h-[800px] bg-gray-100 w-full">
      <h2 className="text-2xl font-semibold mb-6">Your Booked Rooms</h2>
      {bookedRooms && bookedRooms.length > 0 ? (
        <div className="flex gap-4 w-full overflow-x-auto pb-7">
          {bookedRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white min-w-[33%] shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={`../../../../server${room.image_path}`}
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
                  <button
                    
                    className="bg-blue-500 rounded-md text-white px-5 py-2"
                  >
                    Checkout
                  </button>
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
