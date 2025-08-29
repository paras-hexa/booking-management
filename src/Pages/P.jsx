import { useState } from "react";
import { ChevronLeft, MapPin } from "lucide-react";

export const MovieSelection = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toDateString());
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const dates = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const theaters = ["Bukit Bintang", "IOI Putaria", "Himalaya Mall", "Wide Angle", "Acropolitan"];
  const times = ["15:40 PM", "18:40 PM", "21:25 PM", "23:20 PM"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {/* Back button */}
      <button className="flex items-center text-blue-600 mb-6 hover:underline">
        <ChevronLeft size={20} className="mr-1" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side - Date, Theater, Time */}
        <div>
          {/* Date */}
          <h2 className="text-blue-600 font-bold mb-2">Date</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {dates.map((d, i) => {
              const dateLabel = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
              const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
              const isActive = selectedDate === d.toDateString();
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(d.toDateString())}
                  className={`px-4 py-2 rounded-lg border ${
                    isActive ? "bg-blue-600 text-white" : "border-gray-400 text-gray-600"
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
          <div className="flex flex-wrap gap-3 mb-6">
            {theaters.map((theater, i) => (
              <button
                key={i}
                onClick={() => setSelectedTheater(theater)}
                className={`px-4 py-2 rounded-lg flex items-center gap-1 border ${
                  selectedTheater === theater
                    ? "bg-blue-600 text-white"
                    : "border-gray-400 text-gray-600"
                }`}
              >
                <MapPin size={16} /> {theater}
              </button>
            ))}
          </div>

          {/* Time */}
          <h2 className="text-blue-600 font-bold mb-2">Time</h2>
          <div className="flex flex-wrap gap-3">
            {times.map((time, i) => (
              <button
                key={i}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedTime === time ? "bg-blue-600 text-white" : "border-gray-400 text-gray-600"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Movie info */}
        <div>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/f/f2/Kingdom_of_the_Planet_of_the_Apes.png"
            alt="movie poster"
            className="rounded-xl w-64 mb-4"
          />

          <h3 className="text-xl font-bold text-blue-600 mb-2">
            Spiderman Across the Spiderverse
          </h3>
          <p className="text-gray-600 mb-2">Movie description here...</p>
          <p>Duration: 2h 30m</p>
          <p>Language: English</p>
          <p>Type: 2D</p>

          {/* Booking box */}
          <div className="mt-6 border rounded-xl p-4">
            <h4 className="font-bold text-blue-600 mb-2">{selectedTheater || "Select Theater"}</h4>
            <p>{selectedDate}</p>
            <p>{selectedTime || "Select Time"}</p>
            <p className="text-xs text-gray-500 mt-2">
              *Seat selection can be done after this
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
