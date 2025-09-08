import React from "react";
import { useNavigate , useSearchParams} from "react-router-dom";
import { CheckCircle2 } from "lucide-react"; // success tick icon

export const PaymentSuccess = () => {
   const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 via-white to-blue-400 p-4">
      <div className="w-full max-w-xl h-[70vh]  bg-transparent  rounded-2xl p-8 text-center">
       

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Payment Successful
        </h2>
          
 {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4 shadow-inner">
            <CheckCircle2 size={120} className="text-green-500" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-10 mt-18">
          <button
            onClick={() => navigate("/viewmyticket")}
            className="w-full py-5 rounded-md border-blue-500 border-1  bg-white-500 text-blue-500 font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            View Ticket
          </button>

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

