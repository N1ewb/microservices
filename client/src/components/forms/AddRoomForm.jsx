import React, { useState } from "react";
import toast from "react-hot-toast";
import { addRoom } from "../../../actions/admin.actions";

export default function AddRoomForm({ setFormOpen }) {
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [imagePath, setImagePath] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagePath(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !type || !price || !status || !imagePath || !description) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("status", status);
    formData.append("description", description);
    formData.append("image", imagePath);

    try {
      const data = await addRoom(formData);

      if (data.status === 200) {
        toast(data.message);
        setFormOpen(false);
        return;
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add room");
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
              Room Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
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
              Room Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
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
