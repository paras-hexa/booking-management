import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { downloadTicketPDF } from "../utils/downloadticket";
export const BookingDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Booking Detail Location State:", location.state);

  // Format date
  const date = new Date(location.state.date);
  const formatteddate = date.toLocaleDateString("en-GB", {
    weekday: "short", // Mon
    day: "2-digit",   // 23
    month: "short",   // Oct
    year: "numeric",  // 2023
  });

  // Format time
  function formatTo24Hour(isoString) {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  const time = formatTo24Hour(location.state.time.startTime);

  // Group seats by type
  const groupedSeats = location.state.selectedSeats.reduce((acc, seat) => {
    if (!acc[seat.type]) {
      acc[seat.type] = { count: 0, price: seat.price };
    }
    acc[seat.type].count += 1;
    return acc;
  }, {});

  // Totals
  const subtotal = Object.values(groupedSeats).reduce(
    (sum, g) => sum + g.price * g.count,
    0
  );
  const serviceCharge = subtotal * 0.06;
  const total = subtotal + serviceCharge;

  const ticket = {
    movieTitle: location.state.movie.name,
    date: formatteddate,
    time,
    seats: location.state.selectedSeats,
    groupedSeats,
    subtotal,
    serviceCharge,
    total,
  };

  if (!ticket) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-white to-blue-400 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl border border-blue-300 p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-blue-600 mb-4">
          Booking Detail
        </h2>

        {/* Movie Title */}
        <div className="flex flex-col justify-between mb-2">
          <div className="text-gray-500">Movie Title</div>
          <div className="font-semibold">{ticket.movieTitle}</div>
        </div>

        {/* Date */}
        <div className="flex flex-col justify-between mb-2">
          <span className="text-gray-500">Date</span>
          <span className="font-semibold">{ticket.date}</span>
        </div>

        {/* Tickets + Time */}
        <div className="flex justify-between mb-2">

          <div>
          <span className="text-gray-500">
            Ticket ({ticket.seats.length})
          </span>
           <p className="text-blue-500 font-medium mb-4">
          {ticket.seats.map((s) => `${s.seat} `)}
        </p>
         </div>

          <div className="flex flex-col">  
                      <span className="text-gray-500">Hours</span>

            <span className="font-semibold">{ticket.time}</span>
          
          
          </div>
        
        </div>
       

        {/* Transaction Detail */}
        <h3 className="text-blue-600 font-semibold mb-2">
          Transaction Detail
        </h3>

        {/* Category-wise Rows */}
        {Object.entries(ticket.groupedSeats).map(([type, g]) => (
          <div className="flex justify-between mb-1" key={type}>
            <span>
              {type} (₹{g.price} × {g.count})
            </span>
            <span>₹{g.price * g.count}</span>
          </div>
        ))}

        {/* Service Charge */}
        <div className="flex justify-between mb-1">
          <span>Service Charge (6%)</span>
          <span>₹{ticket.serviceCharge.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between font-bold border-t border-gray-300 pt-2 mt-2 mb-4">
          <span>Total payment</span>
          <span>₹{ticket.total.toFixed(2)}</span>
        </div>

        {/* Note */}
        <p className="text-xs text-gray-400 mb-4">
          *Purchased ticket cannot be canceled
        </p>

        {/* Buttons */}
        <button
          onClick={() => navigate("/payment",{state:{
            ...location.state , total
          }}  ) }
          className="w-full py-3 rounded-md bg-white text-blue-500 border-blue-500 border-1 font-semibold mb-3 hover:bg-blue-600 hover:text-white"
        >
          Total Pay ₹{ticket.total.toFixed(2)} Proceed
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 rounded-md border border-gray-300 text-gray-500 font-semibold hover:bg-gray-400 hover:text-black"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
