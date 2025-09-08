import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";

export const Seatmap = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const theater = location.state.theater;
    const movie = location.state.movie;
    const count = location.state.seats;
    const showtimeID = location.state.showtimeID;

    const [seatLayout, setSeatLayout] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);

    useEffect(() => {
        async function fetchLayout() {
            try {
                // Step 1: fetch showtime to get screenId
                const resShowtime = await api.get(`/show-times/${showtimeID}`, {
                    headers,
                });

                const screenId = resShowtime.data.data.screenId;
                // console.log("scrid", screenId);

                // Step 2: fetch screen details
                const resScreen = await api.get(`/screens/${screenId}`, { headers });

                const screenData = resScreen.data.data;

                // Step 3: normalize layout (string or object)

                let parsedLayout = screenData.screen.layout;

                if (typeof (parsedLayout) === "string") {
                    try {
                        parsedLayout = JSON.parse(parsedLayout);
                    } catch (e) {
                        console.error("Invalid layout JSON:", e);
                        parsedLayout = [];
                    }
                } else if (Array.isArray(screenData.layout)) {
                    parsedLayout = screenData.screen.layout;
                }
                // Step 4: map prices by layoutType from the showtime

                const resScreenShow = await api.get(`/screens/${screenId}/showtimes`, { headers });
                // console.log("scrshowdata" , resScreenShow.data);
                
                const showtimes = resScreenShow.data.showTimes || [];
                //  console.log(showtimes);
                 
                // find the matching showtime by ID
             
                const currentShowtime = showtimes.find(st => st.id === showtimeID);
                //  console.log("curr showtime" , currentShowtime);
                 
                const priceMap = {};
                if (currentShowtime?.price) {
                    currentShowtime.price.forEach((p) => {
                        priceMap[p.layoutType] = p.price;
                    });
                }

                // console.log("Final Price Map:", priceMap);

                // Step 5: merge price into layout
                const enrichedLayout = parsedLayout.map((cat) => ({
                    ...cat,
                    price: priceMap[cat.type] || priceMap.Premium,
                }));

                setSeatLayout(enrichedLayout);

                // Auto pre-select seats inline (first N available seats)
                const availableSeats = [];
                enrichedLayout.forEach((cat) => {
                    const { layout, excludedRows = [], excludedSeats = [], excludedColumns = [], price = 0 } = cat;
                    const [startCol, endCol] = layout.columns;
                    const columns = Array.from({ length: endCol - startCol + 1 }, (_, i) => i + startCol);

                    layout.rows.forEach((row) => {
                        if (excludedRows.includes(row)) return;
                        columns.forEach((col) => {
                            const seat = `${row}${col}`;
                            if (
                                !excludedSeats.includes(seat) &&
                                !excludedColumns.includes(col) &&
                                !bookedSeats.includes(seat)
                            ) {
                                availableSeats.push({ seat, price , type : cat.type });
                            }
                        });
                    });
                });

                // take only the number of seats needed (count from state)
                setSelectedSeats(availableSeats.slice(0, count));


                // Step 6: mark booked seats
                setBookedSeats(screenData.bookedSeats?.map((b) => b.seat) || []);
            } catch (err) {
                console.error("Error fetching layout:", err);
            }
        }

        fetchLayout();
    }, [showtimeID]);
  console.log("sl" , seatLayout);
  
    const toggleSeat = (seat, price ,type) => {
  if (bookedSeats.includes(seat)) return;

  const alreadySelected = selectedSeats.find((s) => s.seat === seat);

  if (alreadySelected) {
    // If seat already selected, just deselect it
    setSelectedSeats(selectedSeats.filter((s) => s.seat !== seat));
  } else {
    if (selectedSeats.length < count) {
      // Add normally if under the limit
      setSelectedSeats([...selectedSeats, { seat, price, type }]);
    } else {
      // Remove the oldest seat and add the new one
      const updated = [...selectedSeats.slice(1), { seat, price , type }];
      setSelectedSeats(updated);
    }
  }
};


    const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    console.log("selected seat",selectedSeats);
    
    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-400 via-white to-blue-400">
            <div className="max-w-6xl mx-auto p-6">
                {/* Back Button */}
                <button
                    className="mb-6 text-blue-600 font-bold text-3xl flex items-center"
                    onClick={() => navigate(-1)}
                >
                    ← Select Seat
                </button>

                <div className="flex justify-center">
                    <div className="w-max">
                        {/* Seat Layouts */}
                        {seatLayout.map((cat) => {
                            const {
                                type,
                                layout,
                                excludedRows = [],
                                excludedSeats = [],
                                excludedColumns = [],
                                price = 0,
                            } = cat;

                            const [startCol, endCol] = layout.columns;
                            const columns = Array.from(
                                { length: endCol - startCol + 1 },
                                (_, i) => i + startCol
                            );

                            return (
                                <div key={type} className="mb-8">
                                    {/* Category Header */}
                                    <div className="mb-2 text-left">
                                        <div className="text-lg font-semibold text-gray-800">
                                            ₹{price} {type}
                                        </div>
                                    </div>

                                    <div className="mb-4 w-full">
                                        <hr className="border-gray-300" />
                                    </div>

                                    {/* Render Rows */}
                                    {layout.rows.map((row) => {
                                        if (excludedRows.includes(row)) return null;

                                        return (
                                            <div key={row} className="mb-3">
                                                <div className="grid grid-cols-10 gap-3 justify-items-center">
                                                    {columns.map((col) => {
                                                        const seat = `${row}${col}`;
                                                        if (
                                                            excludedSeats.includes(seat) ||
                                                            excludedColumns.includes(col)
                                                        )
                                                            return null;

                                                        const isSelected = selectedSeats.some(
                                                            (s) => s.seat === seat
                                                        );
                                                        const isBooked = bookedSeats.includes(seat);

                                                        return (
                                                            <button
                                                                key={seat}
                                                                disabled={isBooked}
                                                                onClick={() => toggleSeat(seat, price ,type)}
                                                                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-md border text-xs sm:text-sm flex items-center justify-center transition
                                                                 ${isBooked
                                                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                                                        : isSelected
                                                                            ? "bg-blue-500 text-white border-blue-600"
                                                                            : "bg-white border-gray-300 hover:bg-gray-50"
                                                                    }`}
                                                            >
                                                                {seat}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}

                        {/* Screen Display */}
                        <div className="flex flex-col items-center mt-8">
                            <div className="w-full">
                                <div className="h-2 bg-gray-400 rounded-md" />
                            </div>
                            <p className="text-sm text-gray-600 mt-2 text-center">
                                All eyes this way please!
                            </p>
                        </div>

                        <div className="w-full my-6">
                            <hr className="border-gray-300" />
                        </div>

                        {/* Pay Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={() =>
                                    navigate("/bookingdetails", {
                                        state: { ...location.state, selectedSeats,totalPrice },
                                    })
                                }
                                disabled={selectedSeats.length === 0}
                                className={`px-20 py-3 font-poppins rounded-lg font-semibold transition border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white disabled:opacity-50`}
                            >
                                Pay ₹{totalPrice}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
