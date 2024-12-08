import React, { useEffect, useState } from "react";
import { paymentRecords } from "../../../actions/user.actions";
import { useAuth } from "../../context/AuthContext";

export default function Userpayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const res = await paymentRecords(user.id);

        if (res.status === 200) {
          setPayments(res.data);
        }
      }
    };
    fetchData();
  }, [user]);

  const TableHead = [
    { name: "Payment ID" },
    { name: "Amount" },
    { name: "Payment Method" },
    { name: "Status" },
    { name: "Date" },
    { name: "Action" },
  ];

  return (
    <div className="max-h-full w-full overflow-auto bg-white p-10 flex flex-col gap-4">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Payment Records
        </h2>
        <p className="text-gray-500">View all your payment history below</p>
      </header>
      <main className="flex flex-col gap-4">
        <div className=" rounded-lg ">
          {payments.length > 0 ? (
            <table className="w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  {TableHead.map((header, index) => (
                    <th
                      key={index}
                      className="py-2 px-4 text-left text-sm font-semibold text-gray-600"
                    >
                      {header.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{payment.id}</td>
                    <td className="py-2 px-4">${payment.amount}</td>
                    <td className="py-2 px-4">{payment.payment_method}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`${
                          payment.status === "Completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        } font-semibold`}
                      >
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="py-2 px-4">{payment.payment_date}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => modal.openPaymentModal(payment.id)}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No payment records found</p>
          )}
        </div>
      </main>
    </div>
  );
}
