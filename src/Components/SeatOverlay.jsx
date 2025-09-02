// src/components/SeatSelectionModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";

export const SeatSelectionModal = ({ isOpen, onClose, onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState(null);
  console.log(selectedSeats);
  
  if (!isOpen) return null;



  const handleConfirm = () => {
    if (!selectedSeats) return;
    onConfirm(selectedSeats);
    onClose();
    setSelectedSeats(null); // reset after close
  };

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Overlay */}
  <div
    className="absolute inset-0 "
    onClick={onClose} // close when clicking outside
  ></div>

  {/* Modal */}
  <div className="relative bg-white rounded-2xl shadow-xl w-[420px] p-6 z-10">
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
    >
      ✕
    </button>

    <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
      How many seats?
    </h2>

    {/* Seat buttons */}
    <div className="grid grid-cols-5 gap-4 justify-items-center mb-6">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((seat) => (
        <button
          key={seat}
          onClick={() => setSelectedSeats(seat)}
          className={`w-12 h-12 flex items-center justify-center rounded-md border shadow-sm
            ${
              selectedSeats === seat
                ? "bg-blue-500 text-white border-blue-500"
                : "border-gray-300 hover:bg-gray-100"
            }`}
        >
          {seat}
        </button>
      ))}
    </div>

    {/* Footer buttons */}
    <div className="flex justify-between">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
      >
        Cancel
      </button>
     
      <button
        onClick={handleConfirm}
        disabled={!selectedSeats}
        className={`px-4 py-2 rounded-md ${
          selectedSeats
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Select seats
      </button>
     
    </div>
  </div>
</div>
  );
};

