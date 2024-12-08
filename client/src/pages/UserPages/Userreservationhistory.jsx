import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getBookingHistory } from "../../../actions/user.actions";

export default function Userreservationhistory() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const res = await getBookingHistory(user.id);
        setBookings(res.data);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="max-h-full w-full overflow-auto bg-white p-10 flex flex-col gap-4">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Reservation History
        </h2>
        <p className="text-gray-500">View all your reservation history below</p>
      </header>
      <main className="max-w-full h-full">
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Room Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Reservation Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {booking.room.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {booking.booking_details.reservation_date || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      ${booking.payment.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {booking.payment.status}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <button className="text-blue-500 hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No booking history</p>
        )}
      </main>
    </div>
  );
}
