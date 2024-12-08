import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useRoomDetails } from "../../context/modalContexts/RoomDetailsContext";
import { bookedRoom, getRoomById, reserveRoom } from "../../../actions/user.actions";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function RoomDetails() {
  const { handleToggleRoomDetailsModal } = useRoomDetails();
  const [room, setRoom] = useState();
  const [isReserved, setIsReserved] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");
  const userId = queryParams.get("userId");

  useEffect(() => {
    const fetchData = async () => {
      if (roomId) {
        const res = await getRoomById(roomId);
        setRoom(res.room);
      }
    };
    fetchData();
  }, [roomId]);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const handleReserveRoom = async () => {
    if (!userId || !roomId) {
      toast.error("Please provide valid user and room information.");
      return;
    }
    const formData = {
      userId,
      roomId,
    };

    try {
      const response = await reserveRoom(formData); 
      if (response.success) {
        setIsReserved(true);
        toast.success("Room reserved successfully!");
      } else {
        setError("Failed to reserve room. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      onClick={handleToggleRoomDetailsModal}
      className="absolute w-full h-full bg-[#0000005d] top-0 left-0 "
    >
      <div className="inset-0 z-50 flex h-full w-full justify-center items-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full p-10 md:w-3/4 lg:w-2/3 bg-white rounded-lg shadow-lg flex overflow-hidden"
        >
          {/* Carousel Section */}
          <div className="w-1/2 p-4">
            <Slider {...carouselSettings}>
              {[
                "https://via.placeholder.com/400x300",
                "https://via.placeholder.com/400x300",
                "https://via.placeholder.com/400x300",
              ].map((img, idx) => (
                <div key={idx}>
                  <img
                    src={img}
                    alt={`Room ${idx + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Room Instructions & Reservation Form */}
          <div className="w-1/2 p-6 relative">
            <button
              onClick={handleToggleRoomDetailsModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            {/* Error Message */}
            {error && <div className="text-red-500 mt-4">{error}</div>}

            {/* Reservation Form */}
            {!isReserved ? (
              <div className="flex flex-col justify-between h-full">
                <h3 className="text-lg font-semibold mb-2">
                  Reserve This Room
                </h3>
                
                <div className="flex flex-col gap-4 h-full">
                  <p className="block text-sm font-medium text-gray-700">
                    Name: {room?.name}
                  </p>
                  <p className="block text-sm font-medium text-gray-700">
                    Description: {room?.description}
                  </p>
                  <p className="block text-sm font-medium text-gray-700">
                    Type: {room?.type}
                  </p>
                  <p className="block text-sm font-medium text-gray-700">
                    Amount: {room?.price}
                  </p>
                </div>

                <button
                  onClick={handleReserveRoom}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Reserve Room
                </button>
              </div>
            ) : (
              <div className="text-green-500 mt-4">
                <h3 className="font-semibold">Room Reserved Successfully!</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
