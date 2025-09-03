import { useEffect, useState , useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight,MapPin , ArrowLeft } from "lucide-react";
import { api } from "../api/axiosInstance";
import { Navbar } from "../Components/Navbar";
import { SeatSelectionModal } from "../Components/SeatOverlay";
import { headers } from "../constant";
// 🕒 format UTC -> IST
function formatTimeToIST(dateStr) {
  const {id} = useParams()
  console.log(id);
  
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

// 📅 format date for API query
function formatDateForApi(dateObj) {
  return new Date(dateObj).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }); // yyyy-mm-dd
}

export const TheaterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [theater, setTheater] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // generate next 7 days
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
   useEffect(() => {
     async function fetchtheater() {
      const res = await api.get(`/theaters/${id}`,{
        headers
      })
      setTheater(res.data.data)
     }
     fetchtheater()
   }, [])
   
  // fetch movies + showtimes
  useEffect(() => {
    async function fetchShows() {
      try {
        const formattedDate = formatDateForApi(selectedDate);

        const res = await api.get(`/theaters/${id}/shows`, {
          params: { date: formattedDate },
          headers,
        });

        console.log("API Data:", res.data);

        // API shape: { data: [ {id, name, showTimes: []} ] }
        setMovies(res.data.data || []);
      } catch (err) {
        console.error("Error fetching shows:", err);
      }
    }
    fetchShows();
  }, [id, selectedDate]);

  const handleBookNow = (movie, time) => {
    setSelectedMovie(movie);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const handleConfirmSeats = (seats) => {
    setIsModalOpen(false);
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
const dateScrollRef = useRef(null);
  const [activeTime, setActiveTime] = useState(null);

  const scrollDates = (direction) => {
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollBy({
        left: direction === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="min-h-screen bg-transparent bg-corner-glow">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Back */}
        <div className="flex flex-col">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 mb-4 text-4xl font-bold"
          >
            <ArrowLeft size={30} />
            Theater Name
          </button>

          {/* Theater Info */}
          {theater && (
            <div className="mb-6">
              {theater.location && (
                <p className="flex items-center text-gray-500 ml-9">
                  <MapPin size={16} className="mr-1" />
                  {theater.location}
                </p>
              )}
            </div>
          )}

          {/* Date selector with arrows */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => scrollDates("left")}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
 
            <div
              ref={dateScrollRef}
              className="flex gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide flex-1"
            >
              {dates.map((d) => (
                <button
                  key={d.toDateString()}
                  onClick={() => setSelectedDate(d)}
                  className={`px-4 py-2 rounded-lg border min-w-[90px] text-center transition-all ${
                    selectedDate.toDateString() === d.toDateString()
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-blue-100"
                  }`}
                >
                  <div>
                    {d.toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                  <div className="text-sm">
                    {d.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollDates("right")}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Movies List */}
        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
          {movies.length === 0 ? (
            <p className="text-gray-500">No shows available for this date.</p>
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    {/* Movie Name */}
                    <h2 className="text-lg font-bold text-blue-600">
                      {movie.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {movie.languages?.join(", ")} • {movie.duration} min
                    </p>
                  </div>
                  {/* Book Now */}
                  <button
                    onClick={() =>
                      handleBookNow(movie, movie.showTimes?.[0] || null)
                    }
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg bg-transparent hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Book Now
                  </button>
                </div>

                {/* Showtimes */}
                <div className="flex gap-2 flex-wrap mt-3">
                  {movie.showTimes?.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setActiveTime(st.id)}
                      className={`px-3 py-1 border rounded-md text-sm transition-all ${
                        activeTime === st.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-transparent border-gray-400 text-gray-600 hover:bg-blue-100"
                      }`}
                    >
                      {formatTimeToIST(st.startTime)}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
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
          date={formatDateForApi(selectedDate)}
          time={selectedTime}
        />
      )}
    </div>
  );
};
