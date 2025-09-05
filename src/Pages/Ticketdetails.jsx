import React, { useEffect, useState  } from "react";
import { useNavigate , useLocation } from "react-router-dom";
export const BookingDetail = () => {


const navigate = useNavigate()
const location = useLocation()
console.log(location.state);

const date = new Date(location.state.date);

const formatteddate = date.toLocaleDateString("en-GB", {
  weekday: "short",   // Mon
  day: "2-digit",     // 23
  month: "short",     // Oct
  year: "numeric"     // 2023
});
 
function formatTo24Hour(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
const time = formatTo24Hour(location.state.time.startTime)
console.log(formatTo24Hour("2025-09-05T16:00:00.000Z")); 
// 👉 "21:30" (IST)
console.log( location.state.selectedSeats);

  const ticket ={
  "movieTitle": location.state.movie.name,
  "date": formatteddate,
  "time": time,
  "category": "Middle SEAT",
  "price": 250,
  "seats": location.state.selectedSeats,
  "serviceCharge":(location.state.totalPrice)*0.06 ,
  "total": location.state.totalPrice || 0
};



  if (!ticket) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-white to-blue-400 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl border border-blue-300 p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-blue-600 mb-4">Booking Detail</h2>

        {/* Movie Title */}
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Movie Title</span>
          <span className="font-semibold">{ticket.movieTitle}</span>
        </div>

        {/* Date */}
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Date</span>
          <span className="font-semibold">{ticket.date}</span>
        </div>

        {/* Tickets + Time */}
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">
            Ticket ({ticket.seats.length})
          </span>
          <span className="font-semibold">{ticket.time}</span>
        </div>
        <p className="text-blue-500 font-medium mb-4">
          {ticket.seats.map((s)=>{
            return `${s.seat} `
          })}
        </p>

        {/* Transaction Detail */}
        <h3 className="text-blue-600 font-semibold mb-2">Transaction Detail</h3>
        <div className="flex justify-between mb-1">
          <span>
            {ticket.category} (₹{ticket.price} × {ticket.seats.length})
          </span>
          <span>₹{ticket.price * ticket.seats.length}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Service Charge (6%)</span>
          <span>₹{ticket.serviceCharge}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2 mb-4">
          <span>Total payment</span>
          <span>₹{ticket.total}</span>
        </div>

        {/* Note */}
        <p className="text-xs text-gray-400 mb-4">
          *Purchased ticket cannot be canceled
        </p>

        {/* Buttons */}
        <button onClick={()=>navigate('/payment')} className="w-full py-3 rounded-md bg-white text-blue-500 border-blue-500 border-1 font-semibold mb-3 hover:bg-blue-600 hover:text-white">
          Total Pay ₹{ticket.total} Proceed
        </button>
        <button onClick={()=>navigate(-1)} className="w-full py-3 rounded-md border border-gray-300 text-gray-500 font-semibold hover:bg-gray-400 hover:text-black">
          Cancel
        </button>
      </div>
    </div>
  );
};

