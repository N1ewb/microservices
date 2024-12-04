import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Roomcards({ room }) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  const handleBookRoom = async () => {
    try {
      const reqBody = {
        roomId: room.id,
        userId: user.id,
        date: new Date().toISOString(),
      };

      const response = await api.post("/book/room", reqBody);

      setMessage(response.data.message || "Room successfully booked!");
      console.log("Response message", response.data.message);
    } catch (err) {
      console.error(err);

      setMessage("Failed to book room. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 m-4 max-w-xs">
      <h3 className="text-xl font-semibold text-gray-800">{room.type}</h3>
      <p className="text-lg text-gray-600">${room.price}</p>
      <button
        onClick={handleBookRoom}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
      >
        Book Room
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}
