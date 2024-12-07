import React, { useState, useEffect } from "react";
import { CreditCard, Calendar, Lock } from "lucide-react";
import { useModal } from "../../context/PaymentModalContext";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { bookedRoom } from "../../../actions/user.actions";

export default function PaymentForm() {
  const { handleTogglePaymentModal } = useModal();
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    paymentMethod: "",
    userId: "",
    roomId: "",
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("roomId");
  const userId = queryParams.get("userId");

  useEffect(() => {
    if (roomId && userId) {
      setFormData((prevData) => ({
        ...prevData,
        roomId: roomId,
        userId: userId,
      }));
    }
  }, [roomId, userId]);

  const handleBookRoom = async () => {
    if (!roomId || !userId) {
      toast.error("Missing roomId or userId.");
      return;
    }

    const amount = 3000;

    const payload = {
      ...formData,
      amount: amount,
    };

    try {
      const response = await bookedRoom(payload);
      console.log("Response: ", response);
      if (response.status !== 200) {
        toast.error("Invalid credentials");
      }

      toast(response.data.message || "Room successfully booked!");
    } catch (err) {
      toast.error("Failed to book room. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { cardNumber, expiryDate, cvv, cardholderName, paymentMethod } =
      formData;

    if (
      !cardNumber ||
      !expiryDate ||
      !cvv ||
      !cardholderName ||
      !paymentMethod
    ) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      toast.error("Invalid card number. It should be 16 digits.");
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      toast.error("Invalid expiry date. Use MM/YY format.");
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      toast.error("Invalid CVV. It should be 3 digits.");
      return;
    }

    handleBookRoom();
  };

  return (
    <div
      onClick={handleTogglePaymentModal}
      className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-[#00000062]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Payment Information
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="cardholder-name"
            >
              Cardholder Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CreditCard className="text-gray-500 mr-2" />
              <input
                type="text"
                id="cardholder-name"
                name="cardholderName"
                placeholder="Enter name"
                value={formData.cardholderName}
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="card-number">
              Card Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CreditCard className="text-gray-500 mr-2" />
              <input
                type="text"
                id="card-number"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="expiry-date">
                Expiry Date
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <Calendar className="text-gray-500 mr-2" />
                <input
                  type="text"
                  id="expiry-date"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="cvv">
                CVV
              </label>
              <div className="flex items-center border border-gray-300 rounded-md p-2">
                <Lock className="text-gray-500 mr-2" />
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="payment-method"
            >
              Payment Method
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2">
              <CreditCard className="text-gray-500 mr-2" />
              <input
                type="text"
                id="payment-method"
                name="paymentMethod"
                placeholder="e.g., Credit Card, PayPal"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full outline-none"
              />
            </div>
          </div>

          <div className="mb-4 text-center">
            <p className="text-gray-700 font-semibold">
              Confirm Pay for: <span className="text-blue-500">$3000.00</span>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}
