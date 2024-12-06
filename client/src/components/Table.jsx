import React from "react";
import { useAuth } from "../context/AuthContext";

const DataTable = ({ TableHead, TableData }) => {
  const {user} = useAuth()
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
                <td className="py-3 px-4 text-sm text-gray-700">{item.type}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {item.price}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {item.status}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  <button className="text-blue-500 hover:underline focus:outline-none">
                    {user && user.role === 'admin' ? <p>Edit</p> : <p>Book</p>}
                  </button>
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
