import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";
import { downloadTicketPDF } from "../utils/downloadticket";
export const TicketFinalView = () => {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderId = localStorage.getItem("order response");

  useEffect(() => {
    async function fetchTicket() {
      try {
        const orderId = localStorage.getItem("order response");
        if (!orderId) {
          console.error("No orderId found in localStorage");
          navigate("/home");
          return;
        }

        const res = await api.get(`/orders/${orderId}`, { headers });
        const order = res.data;

        const start = new Date(order.showtime.startTime);

        const mappedTicket = {
          id: order.id,
          date: start.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          movie: order.showtime.movie.name,
          time: start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          theater: order.showtime.screen.theaterName,
          seats: order.seatData.seats.map((s) => `${s.row}${s.column}`),
        };
         
        setTicket(mappedTicket);
      } catch (err) {
        console.error("Error fetching ticket:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTicket();
  }, [navigate]);
   
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Ticket not found</p>
      </div>
    );
  }
 const handlehome = () => {
  localStorage.setItem("order response" , "")
  navigate("/home")

}
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-tr from-blue-400 via-white to-blue-400 p-6">
      
      {/* Ticket Card */}
      <div className="w-full max-w-sm flex flex-col gap-3 bg-transparent rounded-xl border border-blue-500 shadow-md p-6 text-center mt-20">
        
        {/* Date */}
        <div className="mb-4 text-left">
          <p className="text-xl font-medium text-blue-500">Date</p>
          <p className="text-gray-800 font-semibold">{ticket.date}</p>
        </div>

        {/* Movie Title */}
        <div className="mb-4 text-left">
          <p className="text-xl font-medium text-blue-500">Movie Title</p>
          <p className="text-gray-800 font-semibold uppercase">{ticket.movie}</p>
        </div>

        {/* Ticket and Hours */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-xl font-medium text-blue-500">
              Ticket ({ticket.seats.length})
            </p>
            <p className="text-gray-800 font-semibold">{ticket.seats.join(", ")}</p>
          </div>
          <div>
            <p className="text-xl font-medium text-blue-500">Hours</p>
            <p className="text-gray-800 font-semibold">{ticket.time}</p>
          </div>
        </div>

        {/* Download Button */}
        <button
    onClick={()=>downloadTicketPDF(orderId)}
          className="w-full p-4 text-xl rounded-md border border-blue-400 text-blue-500 font-medium hover:bg-blue-500 hover:text-white transition"
        >
          Download Ticket
        </button>
      </div>

      {/* Back to Homepage Button */}
      <div className="mb-10 flex justify-center w-full max-w-sm">
        <button
          onClick={handlehome}
          className="w-full p-4 text-xl rounded-md bg-transparent text-gray-500 border border-black font-medium cursor-pointer hover:bg-gray-400 hover:text-black transition"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};
