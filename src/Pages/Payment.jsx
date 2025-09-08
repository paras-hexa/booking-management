import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";

export const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get data from navigation state OR from localStorage
  const [data, setData] = useState(null);

  useEffect(() => {
    if (location.state) {
      // Save to localStorage for refresh
      localStorage.setItem("paymentData", JSON.stringify(location.state));
      setData(location.state);
    } else {
      // Load from localStorage if available
      const saved = localStorage.getItem("paymentData");
      if (saved) {
        setData(JSON.parse(saved));
      }
    }
  }, [location.state]);

  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePay = async () => {
    if (!data) {
      alert("No booking data found. Please go back and select seats again.");
      return;
    }

    try {
      setLoading(true);

      // build seatData
      const seatData = {
        seats: data.selectedSeats.map((s) => {
          const row = s.seat.match(/[A-Z]/)[0]; // extract row letter
          const column = parseInt(s.seat.match(/\d+/)[0]); // extract column number
          return {
            row,
            column,
            layoutType: s.type, // e.g. Classic, Platinum
          };
        }),
      };

      const orderPayload = {
        showtimeId: data.showtimeID,
        seatData,
      };
      console.log("Order payload:", orderPayload);

      // make POST request to your backend
      const response = await api.post("/orders", orderPayload, { headers });
      console.log("Order response:", response);

      if (response.status !== 201) {
        throw new Error("Failed to create order");
      }

      const result = response.data;
      const { paymentUrl, orderId } = result;

      // ✅ Redirect to payment gateway
      window.location.href = paymentUrl;

      // If you want to skip external payment for now:
      // navigate("/paymentsuccess", { state: { ...data, orderId } });

    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading booking data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-white to-blue-400 p-4">
      <div className="w-full max-w-md bg-white border border-blue-400 shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Payment</h2>
        <hr className="mb-6" />

        <p className="font-bold mb-2 text-l">Pay With:</p>
        <label className="flex items-center space-x-2 mb-6">
          <input type="radio" checked readOnly className="text-blue-500" />
          <span>Credit Card</span>
        </label>

        <div className="mb-4">
          <label className="block text-l font-bold text-black-600 mb-1">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="4242 4242 4242 4242"
            className="w-full border rounded-md p-2"
          />
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <label className="block text-l font-bold text-black-600 mb-1">
              Expiration Date
            </label>
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

        <label className="flex items-center space-x-2 mb-6">
          <input
            className="shadow-md"
            type="checkbox"
            name="saveCard"
            checked={form.saveCard}
            onChange={handleChange}
          />
          <span className="text-sm text-gray-600 shadow-md">
            Save card details
          </span>
        </label>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3 mb-3 rounded-md border border-blue-400 text-blue-600 font-semibold hover:bg-blue-500 hover:text-white"
        >
          {loading ? "Processing..." : `Total Pay ₹${data.total}`}
        </button>

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
