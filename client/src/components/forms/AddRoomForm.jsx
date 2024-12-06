import React, { useState } from "react";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

export default function AddRoomForm({ setFormOpen }) {
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [imagePath, setImagePath] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !price || !status || !imagePath) {
      alert("Please fill in all fields");
      return;
    }
    const roomData = {
      type,
      price,
      status,
      image_path: imagePath,
    };

    try {
      const response = await api.post("http://localhost:4004/room", {
        ...roomData,
      });
      const data = await response.room;

      if (data.status === 200) {
        toast(data.message);
        return;
      }
      
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      onClick={() => setFormOpen(false)}
      className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-[#00000062]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add a New Room
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Room Type
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Image Path
            </label>
            <input
              type="file"
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Room
          </button>
        </form>
      </div>
    </div>
  );
}
