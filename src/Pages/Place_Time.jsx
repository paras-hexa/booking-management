import { Link } from "react-router-dom";
import { useState } from "react";
import { Navbar } from "../Components/Navbar";
import { ChevronLeft, MapPin } from "lucide-react";
import { SeatSelectionModal } from "../Components/SeatOverlay"; // reusable modal

export const PlaceAndTime = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toDateString());
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(null);

  const dates = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const theaters = ["Bukit Bintang", "IOI Putaria", "Himalaya Mall", "Wide Angle", "Acropolitan"];
  const times = ["15:40 PM", "18:40 PM", "21:25 PM", "23:20 PM"];

  // Handle confirm seats
  const handleConfirmSeats = async (seats) => {
    setSelectedSeats(seats);

    // await api.post("/booking", {
    //   date: selectedDate,
    //   theater: selectedTheater,
    //   time: selectedTime,
    //   seats,
    // });

    console.log("Booking details confirmed:", {
      date: selectedDate,
      theater: selectedTheater,
      time: selectedTime,
      seats
    });
  };

  return (
    <div className={`min-h-screen bg-corner-glow relative z-10 `}>
      <Navbar />

      <div className={`px-5 py-2 max-w-6xl mx-auto transition-all duration-300 `}>
        <div className="min-h-screen bg-transparent p-2">
          {/* Back button */}
          <Link to={"/home"} className="flex items-center text-grey-100 mt-2 hover:text-blue-600">
            <ChevronLeft size={20} className="mr-1" /> Back
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side - Date, Theater, Time */}
            <div className="mt-10 py-4">
              {/* Date */}
              <h2 className="text-blue-600 font-bold mb-2">Date</h2>
              <div className="flex flex-wrap gap-3 m-5">
                {dates.map((d, i) => {
                  const dateLabel = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
                  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
                  const isActive = selectedDate === d.toDateString();
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(d.toDateString())}
                      className={`${
                        isActive
                          ? "bg-blue-600 text-white px-4 py-2 rounded-lg border"
                          : "border-gray-400 text-gray-600 px-4 py-2 rounded-lg border hover:bg-blue-200"
                      }`}
                    >
                      <div>{dateLabel}</div>
                      <div>{weekday}</div>
                    </button>
                  );
                })}
              </div>

              {/* Theater */}
              <h2 className="text-blue-600 font-bold mb-2">Theater</h2>
              <div className="flex flex-wrap gap-3 m-5">
                {theaters.map((theater, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTheater(theater)}
                    className={`gap-1 border ${
                      selectedTheater === theater
                        ? "bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                        : "border-gray-400 text-gray-600 px-4 py-2 rounded-lg flex items-center hover:bg-blue-200"
                    }`}
                  >
                    <MapPin size={16} /> {theater}
                  </button>
                ))}
              </div>

              {/* Time */}
              <h2 className="text-blue-600 font-bold mb-2">Time</h2>
              <div className="flex flex-wrap gap-3 m-5">
                {times.map((time, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTime(time)}
                    className={`${
                      selectedTime === time
                        ? "bg-blue-600 text-white py-2 rounded-lg border px-4"
                        : "border-gray-400 text-gray-600 py-2 px-4 rounded-lg border hover:bg-blue-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Movie info */}
            <div className="mt-0">
              <img
                src="https://assets-prd.ignimgs.com/2023/05/18/sv2-busshltr-tsr-spot-02-1684442303112.jpg"
                alt="movie poster"
                className="rounded-xl w-[350px] h-[350px] mb-4"
              />

              <h3 className="text-xl font-bold text-blue-600 mb-2">
                Spiderman Across the Spiderverse
              </h3>
              <p className="text-gray-600 mb-2">Movie description here...</p>
              <p>Duration: 2h 30m</p>
              <p>Language: English</p>
              <p>Type: 2D</p>

              {/* Booking box */}
              <div className="mt-6 border rounded-xl p-8 flex justify-center items-center flex-col">
                <h4 className="font-bold text-blue-600 mb-2">
                  {selectedTheater || "Select Theater"}
                </h4>
                <p>{selectedDate}</p>
                <p>{selectedTime || "Select Time"}</p>
                <p className="text-xs text-gray-500 mt-2">
                  *Seat selection can be done after this
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!selectedTheater || !selectedTime}
                  className={`mt-4 px-4 py-2 rounded-lg ${
                    selectedTheater && selectedTime
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 Modal overlay always sits above everything */}
     {isModalOpen && (
  <div className="fixed inset-0 z-50 flex justify-center items-center">
    {/* Overlay - just dark layer */}
    <div 
 
      onClick={() => setIsModalOpen(false)} 
    />

    {/* Modal box on top */}
    <div className="relative z-10">
      <SeatSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSeats}
      />
    </div>
  </div>
)}
</div>

    
  );
};
