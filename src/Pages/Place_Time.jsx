import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "../Components/Navbar";
import { ChevronLeft, MapPin } from "lucide-react";
import { SeatSelectionModal } from "../Components/SeatOverlay"; // reusable modal
import { useParams } from "react-router-dom";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";
import { useNavigate } from "react-router-dom";

export const PlaceAndTime = () => {
  const { id } = useParams()

  const today = new Date();
  const Navigate = useNavigate()
  const [moviedata, setmoviedata] = useState({})
  const [selectedDate, setSelectedDate] = useState(today.toDateString());
  const [selectedTheater, setSelectedTheater] = useState({});
  const [selectedTime, setSelectedTime] = useState(null);
  const [theaters, settheaters] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(null);

  const dates = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });



  async function fetchshowtime(params) {
    try {
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0]; // yyyy-mm-dd
      const res = await api.get(`/show-times/${id}/by-date`, {
        params: { date: formattedDate },
        headers: headers
      })
      settheaters(res.data.theaters || []);

      console.log(res.data);
    } catch (error) {
      console.log(error);

    }

  }



  async function fetchmoviedata() {
    try {
      const res = await api.get(`/movies/${id}`, {
        headers: headers
      })
      setmoviedata(res.data)
    } catch (error) {

    }
  }



  useEffect(() => {
    fetchmoviedata()
  }, [id])

  useEffect(() => {
    fetchshowtime()
  }, [id, selectedDate])

  const times = ["15:40 PM", "18:40 PM", "21:25 PM", "23:20 PM"];
  // Handle confirm seats
  const handleConfirmSeats = async (seats) => {
    setSelectedSeats(seats);
    console.log(seats);
    console.log(selectedSeats);


    Navigate('/seatselection', {
      state: {
        movie: moviedata,
        date: selectedDate,
        time: selectedTime,
        theater: selectedTheater,
        seats: seats
      }
    })
    // await api.post("/booking", {
    //   date: selectedDate,
    //   theater: selectedTheater,
    //   time: selectedTime,
    //   seats,
    // });

    console.log("Booking details confirmed:", {
      movie: moviedata,
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
              <div className="flex flex-wrap gap-3 my-5">
                {dates.map((d, i) => {
                  const dateLabel = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
                  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
                  const isActive = selectedDate === d.toDateString();
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(d.toDateString())}
                      className={`${isActive
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 my-5 p-0">
                {theaters.map((theater) => (
                  <button
                    key={theater.id}
                    onClick={() => setSelectedTheater(theater)}
                    className={`border   flex items-center  p-1 py-2 rounded-lg gap-2
                      ${selectedTheater.id === theater.id
                        ? "bg-blue-600 text-white"
                        : "border-gray-400 text-gray-600 hover:bg-blue-200"
                      }`}
                    style={{ minHeight: "48px" }}
                  >
                    <MapPin size={20} className="inline-block" />
                    <span className="truncate text-sm ">{theater.name}</span>
                  </button>
                ))}
              </div>
              {/* Time */}
              <h2 className="text-blue-600 font-bold mb-2">Time</h2>
              <div className="flex flex-wrap gap-3 my-5">
                {selectedTheater?.showtimes && selectedTheater.showtimes.length > 0 ? (
                  selectedTheater.showtimes.map((show, i) => {
                    // format UTC to local readable time
                    const time = new Date(show.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <button
                        key={show.showTimeId}
                        onClick={() => setSelectedTime(time)}
                        className={`${selectedTime === time
                            ? "bg-blue-600 text-white py-2 rounded-lg border px-4"
                            : "border-gray-400 text-gray-600 py-2 px-4 rounded-lg border hover:bg-blue-200"
                          }`}
                      >
                        {time}
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
                  {selectedTheater.name || "Select Theater"}
                </h4>
                <p>{selectedDate}</p>
                <p>{selectedTime || "Select Time"}</p>
                <p className="text-xs text-gray-500 mt-2">
                  *Seat selection can be done after this
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!selectedTheater || !selectedTime}
                  className={`mt-4 px-4 py-2 rounded-lg ${selectedTheater && selectedTime
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
