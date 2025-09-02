import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin } from "lucide-react";
import { Navbar } from "../Components/Navbar";
import { SeatSelectionModal } from "../Components/SeatOverlay";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";

export const TheaterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [theater, setTheater] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // generate next 5 days
  const today = new Date();
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/theaters/${id}/movies`, { headers }); 
        console.log(res.data);
        
        setTheater(res.data.data);
         
        // assuming API returns movies inside theater
        setMovies(res.data.data.movies || []);
      } catch (err) {
        console.error("Error fetching theater:", err);
      }
    }
    fetchData();
  }, [id]);

  const handleBookNow = (movie, time) => {
    setSelectedMovie(movie);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  console.log(theater,movies);
  
  const handleConfirmSeats = (seats) => {
    setIsModalOpen(false);
 
    // Navigate with booking data
    navigate("/seatselection", {
      state: {
        theater,
        movie: selectedMovie,
        date: selectedDate,
        time: selectedTime,
        seats,
      },
    });
  };

  return (
    <div className="min-h-screen bg-transparent">
     

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 mb-4"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        {/* Theater Info */}
        {theater && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-700">
              {theater.name}
            </h1>
            <p className="flex items-center text-gray-500">
              <MapPin size={16} className="mr-1" />
              {theater.location}
            </p>
          </div>
        )}

        {/* Date selector */}
        <div className="flex gap-2 overflow-x-auto mb-6">
          {dates.map((d) => (
            <button
              key={d.toDateString()}
              onClick={() => setSelectedDate(d.toDateString())}
              className={`px-4 py-2 rounded-lg border ${
                selectedDate === d.toDateString()
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {d.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                weekday: "short",
              })}
            </button>
          ))}
        </div>

        {/* Movies List */}
         <div className="space-y-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="border-b border-gray-200 pb-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{movie.name}</h2>
                <p className="text-sm text-gray-500">{movie.languages}, 2D</p>
{/* 
                <div className="flex gap-2 mt-2">
                  {movie.times?.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleBookNow(movie, time)}
                      className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-blue-100"
                    >
                      {time}
                    </button>
                  ))}
                </div> */}
              </div>

              <button
                onClick={() =>
                  handleBookNow(movie, movie.times?.[0] || null)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Seat selection modal */}
      {isModalOpen && (
        <SeatSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmSeats}
          movie={selectedMovie}
          theater={theater}
          date={selectedDate}
          time={selectedTime}
        />
      )}
    </div>
  );
};
