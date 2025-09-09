import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react"; // cancel cross icon

export const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-white to-blue-400 p-4">
      <div className="w-full max-w-xl h-[70vh] bg-transparent rounded-2xl p-8 text-center">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Payment Cancelled
        </h2>

        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4 shadow-inner">
            <XCircle size={120} className="text-red-500" />
          </div>
        </div>

        {/* Button */}
        <div className="flex flex-col space-y-10 mt-18">
          <button
            onClick={() => navigate("/home")}
            className="w-full py-5 rounded-md bg-transparent text-gray-500 border-gray-500 border-1 font-semibold hover:bg-gray-400 hover:text-black transition"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
