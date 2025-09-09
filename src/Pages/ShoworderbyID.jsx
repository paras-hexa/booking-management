import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";
import { CheckCircle } from "lucide-react"; // icon

export const TicketScanView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await api.get(`/orders/${orderId}`, { headers });
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Scanning ticket...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-lg text-red-500 font-semibold">Ticket not found ❌</p>
      </div>
    );
  }

  const start = new Date(order.showtime.startTime);
  const date = start.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-green-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        
        {/* Top Success Banner */}
        <div className="bg-green-500 flex flex-col items-center justify-center p-6">
          <CheckCircle className="w-16 h-16 text-white mb-2" />
          <h1 className="text-2xl font-bold text-white">Ticket Scanned</h1>
          <p className="text-green-50 text-sm">Valid Entry</p>
        </div>

        {/* Ticket Details */}
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Movie</p>
            <p className="text-lg font-semibold text-gray-800 uppercase">
              {order.showtime.movie.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Theater</p>
            <p className="text-lg font-medium text-gray-800">
              {order.showtime.screen.theaterName}
            </p>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-medium text-gray-800">{date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="text-lg font-medium text-gray-800">{time}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Seats</p>
            <p className="text-lg font-medium text-gray-800">
              {order.seatData.seats.map((s) => `${s.row}${s.column} (${s.layoutType})`).join(", ")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="text-xs font-mono text-gray-700 break-all">{order.transactionId}</p>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="bg-gray-50 p-4 flex justify-center">
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
