import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import Roomcards from "../components/Roomcards";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [availableRooms, setAvailableRooms] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        const response = await api.get("/show/rooms");
        setAvailableRooms(response.data.availableRooms);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <button onClick={logout}>Logout</button>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Welcome, {user?.username}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {availableRooms
            ? availableRooms.length > 0
              ? availableRooms.map((room) => (
                  <Roomcards key={room.id} room={room} />
                ))
              : "No available rooms"
            : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
