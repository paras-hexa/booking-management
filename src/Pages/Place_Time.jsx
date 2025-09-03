import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Navbar } from "../Components/Navbar";
import { ChevronLeft, MapPin } from "lucide-react";
import { SeatSelectionModal } from "../Components/SeatOverlay"; // reusable modal
import { useParams } from "react-router-dom";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";
import { useNavigate } from "react-router-dom";

export const PlaceAndTime = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const today = new Date();
  const [moviedata, setMoviedata] = useState({});
  const [selectedDate, setSelectedDate] = useState(today.toDateString());

  // ✅ keep IDs, not whole objects
  const [selectedTheaterId, setSelectedTheaterId] = useState(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState(null);

  const [theaters, setTheaters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(null);

  const dates = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  // ✅ derive from latest theaters array
  const selectedTheater = useMemo(
    () => theaters.find(t => t.id === selectedTheaterId) || null,
    [theaters, selectedTheaterId]
  );

  const selectedShowtime = useMemo(() => {
    if (!selectedTheater) return null;
    return selectedTheater.showtimes?.find(s => s.showTimeId === selectedShowtimeId) || null;
  }, [selectedTheater, selectedShowtimeId]);



  function formatDateToIST(dateStr) {
    const d = new Date(dateStr);
    console.log(d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) , dateStr);
    
    return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    // "YYYY-MM-DD"
  }

  const formattedDate = formatDateToIST(selectedDate);
  async function fetchShowtime() {
    try {

      const utcDate = new Date(selectedDate);
      utcDate.setUTCHours(0, 0, 0, 0);
      // const formattedDate = utcDate.toISOString().split("T")[0];
      const res = await api.get(`/show-times/${id}/by-date`, {
        params: { date: formattedDate },
        headers,
      });

      const nextTheaters = res.data.theaters || [];
      setTheaters(nextTheaters);

      if (selectedTheaterId) {
        const stillExists = nextTheaters.some(t => t.id === selectedTheaterId);
        if (!stillExists) {
          setSelectedTheaterId(null);
        }
      }

      // ✅ always reset showtime when date changes
      setSelectedShowtimeId(null);
    } catch (error) {
      console.log(error);
      setTheaters([]);
      setSelectedTheaterId(null);
      setSelectedShowtimeId(null);
    }
  }

  async function fetchMovieData() {
    try {
      const res = await api.get(`/movies/${id}`, { headers });
      setMoviedata(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMovieData();
  }, [id]);

  useEffect(() => {
    fetchShowtime();
  }, [id, selectedDate]);

  const handleConfirmSeats = (seats) => {
    setSelectedSeats(seats);

    navigate("/seatselection", {
      state: {
        movie: moviedata,
        date: selectedDate,
        theater: selectedTheater,     // full current theater object
        time: selectedShowtime,       // full current showtime object
        seats,
      },
    });
  };

  return (
    <div className={`min-h-screen bg-corner-glow relative z-10 `}>
      <Navbar />
      <div className={`px-5 py-2 max-w-6xl mx-auto transition-all duration-300 `}>
        <div className="min-h-screen bg-transparent p-2">
          <Link to={"/home"} className="flex items-center text-grey-100 mt-2 hover:text-blue-600">
            <ChevronLeft size={20} className="mr-1" /> Back
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="mt-10 py-4">
              {/* Date */}
              <h2 className="text-blue-600 font-bold mb-2">Date</h2>
              <div className="flex flex-wrap gap-3 my-5">
                {dates.map((d, i) => {
                  const dateLabel = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
                  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
                  const isActive = selectedDate === d.toDateString();
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(d.toDateString())}
                      className={
                        isActive
                          ? "bg-blue-600 text-white px-4 py-2 rounded-lg border"
                          : "border-gray-400 text-gray-600 px-4 py-2 rounded-lg border hover:bg-blue-200"
                      }
                    >
                      <div>{dateLabel}</div>
                      <div>{weekday}</div>
                    </button>
                  );
                })}
              </div>

              {/* Theater */}
              <h2 className="text-blue-600 font-bold mb-2">Theater</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 my-5">
                {theaters.map((theater) => (
                  <button
                    key={theater.id}
                    onClick={() => {
                      setSelectedTheaterId(theater.id);
                      setSelectedShowtimeId(null); // reset time when theater changes
                    }}
                    className={`border flex items-center p-1 py-2 rounded-lg gap-2 ${selectedTheaterId === theater.id
                      ? "bg-blue-600 text-white"
                      : "border-gray-400 text-gray-600 hover:bg-blue-200"
                      }`}
                    style={{ minHeight: "48px" }}
                  >
                    <MapPin size={20} className="inline-block" />
                    <span className="truncate text-sm">{theater.name}</span>
                  </button>
                ))}
              </div>

              {/* Time */}
              <h2 className="text-blue-600 font-bold mb-2">Time</h2>
              <div className="flex flex-wrap gap-3 my-5">
                {selectedTheater?.showtimes?.length ? (
                  selectedTheater.showtimes.map((show) => {
                    const label = new Date(show.startTime).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    });
                    return (
                      <button
                        key={show.showTimeId}
                        onClick={() => setSelectedShowtimeId(show.showTimeId)}
                        className={
                          selectedShowtimeId === show.showTimeId
                            ? "bg-blue-600 text-white py-2 rounded-lg border px-4"
                            : "border-gray-400 text-gray-600 py-2 px-4 rounded-lg border hover:bg-blue-200"
                        }
                      >
                        {label}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No showtimes available</p>
                )}
              </div>
            </div>

            {/* Right Side - Movie info */}
            {/* Right Side - Movie info */}
            <div className="mt-0">
              <img
                src={moviedata.image}
                alt="movie poster"
                className="rounded-xl w-[350px] h-[350px] mb-4 object-cover"
              />

              {/* Movie Name */}
              <h3 className="text-xl font-bold text-blue-600 mb-2">
                {moviedata.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-2">{moviedata.description}</p>

              {/* Duration */}
              <p className="text-gray-700 mb-1">
                Duration:{" "}
                {moviedata.duration
                  ? `${Math.floor(moviedata.duration / 60)}h ${moviedata.duration % 60}m`
                  : "N/A"}
              </p>

              {/* Languages */}
              <p className="text-gray-700 mb-1">
                Languages:{" "}
                {Array.isArray(moviedata.languages)
                  ? moviedata.languages.join(", ")
                  : "N/A"}
              </p>

              {/* Categories */}
              <p className="text-gray-700 mb-1">
                Categories:{" "}
                {Array.isArray(moviedata.category)
                  ? moviedata.category.join(", ")
                  : "N/A"}
              </p>

              {/* Format (Static Example) */}
              <p className="text-gray-700 mb-1">Type: 2D</p>

              {/* Booking box */}
              <div className="mt-6 border rounded-xl p-8 flex justify-center items-center flex-col">
                <h4 className="font-bold text-blue-600 mb-2">
                  {selectedTheater?.name || "Select Theater"}
                </h4>
                <p>{selectedDate}</p>
                <p>
                  {selectedShowtime
                    ? new Date(selectedShowtime.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : "Select Time"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  *Seat selection can be done after this
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!selectedTheater || !selectedShowtime}
                  className={`mt-4 px-4 py-2 rounded-lg ${selectedTheater && selectedShowtime
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
