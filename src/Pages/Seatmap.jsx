import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";

export const Seatmap = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(
        location.state
    );

    const theater = location.state.theater;
    const movie = location.state.movie;
    const count = location.state.seats;
    const showtimeID = location.state.showtimeID;

    console.log(showtimeID);

    const [seatLayout, setSeatLayout] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        async function fetchLayout() {
            try {
                const res = await api.get(`/show-times/${showtimeID}`, {
                    headers: headers,
                });

                const layoutStr = res.data.data.screen.layout;
                console.log(layoutStr);
                
                const parsedLayout = JSON.parse(layoutStr); // Convert from string to object
                console.log(parsedLayout);
                
                setSeatLayout(parsedLayout);
            } catch (err) {
                console.error("Error fetching layout:", err);
            }
        }

        fetchLayout();
    }, [showtimeID]);

    const toggleSeat = (seat, price) => {
        const alreadySelected = selectedSeats.find((s) => s.seat === seat);

        if (alreadySelected) {
            setSelectedSeats(selectedSeats.filter((s) => s.seat !== seat));
        } else {
            if (selectedSeats.length < count) {
                setSelectedSeats([...selectedSeats, { seat, price }]);
            } else {
                alert(`You can select maximum ${count} seats`);
            }
        }
    };

    const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);

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
                            const columns = Array.from({ length: endCol - startCol + 1 }, (_, i) => i + startCol);

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
                                                        if (excludedSeats.includes(seat) || excludedColumns.includes(col)) return null;

                                                        const isSelected = selectedSeats.some((s) => s.seat === seat);

                                                        return (
                                                            <button
                                                                key={seat}
                                                                onClick={() => toggleSeat(seat, price)}
                                                                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-md border text-xs sm:text-sm flex items-center justify-center transition
                                ${isSelected
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
                            <p className="text-sm text-gray-600 mt-2 text-center">All eyes this way please!</p>
                        </div>

                        <div className="w-full my-6">
                            <hr className="border-gray-300" />
                        </div>

                        {/* Pay Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate("/bookingdetails", { state: { ...location.state, selectedSeats } })}
                                disabled={selectedSeats.length === 0}
                                className={`px-20 py-3 font-poppins rounded-lg font-semibold transition border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white`}
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
