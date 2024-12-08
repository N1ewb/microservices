import React, { useEffect } from "react";
import { useCheckin } from "../../context/modalContexts/ConfirmCheckInContext";
import { useLocation } from "react-router-dom";
import { checkIn, getRoomById } from "../../../actions/user.actions";
import toast from "react-hot-toast";

export default function CheckinModal() {
  const { handleToggleCheckinModal } = useCheckin();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reservation_id = queryParams.get("reservation_id");

  const handleCheckin = async () => {
    if (reservation_id) {
      const res = await checkIn(reservation_id);
      console.log(res);
      if (res.status === 200) {
        toast.success("Checked In room succesfuly");
      } else {
        toast.error("Error in checking in room");
      }
    }
  };

  return (
    <div
      onClick={handleToggleCheckinModal}
      className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-[#00000062]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-96 p-6 flex flex-col items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Confirm Check-in</h2>
        <p className="text-center mb-6">
          Are you sure you want to check in? This action cannot be undone.
        </p>
        <div className="flex justify-around w-full">
          <button
            onClick={handleToggleCheckinModal}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => handleCheckin()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
