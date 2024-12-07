import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import EditRoomButton from "./ buttons/EditRoomButton";
import BookRoomButton from "./ buttons/BookRoomButton";
import PaymentForm from "./forms/Paymentform";

const DataTable = ({ TableHead, TableData }) => {
  const {user} = useAuth()
  const [openModal, setOpenModal] = useState(false);
  const handleToggleModal = () => {
    setOpenModal(!openModal);
  };
  return (
    <div className="overflow-x-auto rounded-lg  w-full ">
      {/* Table Component */}
      <table className="min-w-full table-auto">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
            {TableHead && TableHead.length > 0 ? (
              TableHead.map((head, index) => (
                <th key={index} className="py-3 px-4 text-left text-sm">
                  {head.name}
                </th>
              ))
            ) : (
              <th colSpan="5" className="py-3 px-4 text-center text-gray-500">
                No Table Head
              </th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {TableData && TableData.length > 0 ? (
            TableData.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition duration-200 border-b border-gray-200"
              >
                <td className="py-3 px-4 text-sm text-gray-700">{item.name || "N/A"}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {item.price}
                </td>
                <td className={`py-3 px-4 text-sm ${item.status === 'booked'? 'text-red-600' : 'text-green-500'} `}>
                  {item.status}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  <div className="text-blue-500 hover:underline focus:outline-none">
                    {item.status === 'booked' ? user && user.role === 'admin' ? <EditRoomButton /> : <BookRoomButton roomId={item.id} userId={user.id} /> : ''}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-3 px-4 text-center text-gray-500">
                No Table Data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
    </div>
  );
};

export default DataTable;
