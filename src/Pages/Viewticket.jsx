import React from "react";
import { useNavigate } from "react-router-dom";

export const TicketFinalView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-tr from-blue-400 via-white to-blue-400 p-6">
      {/* Ticket Card */}
      <div className="w-full h-[60vh] pt-15 flex gap-3 flex-col max-w-sm bg-transparent rounded-xl border border-blue-500 shadow-md p-6 text-center mt-20">
        
        {/* Date */}
        <div className="mb-4 text-left">
          <p className="text-sm font-medium text-blue-500">Date</p>
          <p className="text-gray-800 font-semibold">Mon, 23 Oct 2023</p>
        </div>

        {/* Movie Title */}
        <div className="mb-4 text-left">
          <p className="text-sm font-medium text-blue-500">Movie Title</p>
          <p className="text-gray-800 font-semibold uppercase">
            SPIDERMAN NO WAY HOME
          </p>
        </div>

        {/* Ticket and Hours */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-sm font-medium text-blue-500">Ticket (3)</p>
            <p className="text-gray-800 font-semibold">C8, C9, C10</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-500">Hours</p>
            <p className="text-gray-800 font-semibold">14:40</p>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={() => alert("Downloading Ticket...")}
          className="w-full p-4 rounded-md border border-blue-400 text-blue-500 font-medium hover:bg-blue-500 hover:text-white transition"
        >
          Download Ticket
        </button>
      </div>

      {/* Back to Homepage Button */}
      <div className="mb-10  flex justify-center">
        <button
          onClick={() => navigate("/home")}
          className="px-25 py-4   rounded-md bg-transparent text-gray-500 border-1 border-black font-medium cursor-pointer hover:bg-gray-400 hover:text-black transition"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

