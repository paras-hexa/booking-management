import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const PaymentPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePay = () => {
    // Normally here you'd handle payment logic
    navigate("/paymentsuccess"); // go to payment done page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-white to-blue-400 p-4">
      <div className="w-full max-w-md bg-white border border-blue-400 shadow-md rounded-xl p-6">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Payment</h2>
        <hr className="mb-6" />

        {/* Pay With */}
        <p className="font-bold mb-2 text-l">Pay With:</p>
        <label className="flex items-center space-x-2 mb-6">
          <input type="radio" checked readOnly className="text-blue-500" />
          <span>Credit Card</span>
        </label>

        {/* Card Number */}
        <div className="mb-4">
          <label className="block text-l font-bold text-black-600 mb-1">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9101 1121"
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Expiry + CVV */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-l font-bold text-black-600 mb-1">Expiration Date</label>
            <input
              type="text"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              className="w-full border rounded-md p-2"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-sm text-gray-600 mb-1">CVV</label>
            <input
              type="password"
              name="cvv"
              value={form.cvv}
              onChange={handleChange}
              placeholder="123"
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>

        {/* Save card */}
        <label className="flex items-center space-x-2 mb-6">
          <input 
          className="shadow-md"
            type="checkbox"
            name="saveCard"
            checked={form.saveCard}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-600 shadow-md">Save card details</span>
        </label>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          className="w-full py-3 mb-3 rounded-md border border-blue-400 text-blue-600 font-semibold hover:bg-blue-500 hover:text-white"
        >
          Total Pay ₹800
        </button>

        {/* Cancel Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 rounded-md border border-gray-300 text-gray-500 font-semibold hover:bg-gray-300 hover:text-black"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

