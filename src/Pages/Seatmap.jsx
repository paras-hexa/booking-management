import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";

export const Seatmap = () => {
    const location = useLocation()
    console.log(location.state);    
    const navigate = useNavigate();
    
    const theater = location.state.theater
    const movie = location.state.movie
    const count = location.state.seats
    

    async function fetchlayout(){
        const res = await api.get(`/theaters/${theater.id}/screens` , {
            headers:headers
        })
        console.log(res.data);
        
    }
    
    useEffect(() => {
      fetchlayout()
    }, [])
    

    const seatCategories = [
        { name: "Platinum", price: 520, rows: ["A", "B"] },
        { name: "Slider Sofa", price: 250, rows: ["C", "D", "E"] },
        { name: "Lounger", price: 150, rows: ["F", "G"] },
    ];

    const [selectedSeats, setSelectedSeats] = useState([]);
    const seatLimit = 3;

    const toggleSeat = (seat, price) => {
        const already = selectedSeats.find((s) => s.seat === seat);
        if (already) {
            setSelectedSeats(selectedSeats.filter((s) => s.seat !== seat));
        } else {
            if (selectedSeats.length < seatLimit) {
                setSelectedSeats([...selectedSeats, { seat, price }]);
            } else {
                alert(`You can select maximum ${seatLimit} seats`);
            }
        }
    };

    const totalPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);

    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-400 via-white to-blue-400">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <button
                    className="mb-6 text-blue-600 font-bold text-3xl flex items-center"
                    onClick={() => navigate(-1)}
                >
                    ← Select Seat
                </button>

                {/* Centered seat map */}
                <div className="flex justify-center">
                    <div className="w-max">
                        {seatCategories.map((cat) => (
                            <div key={cat.name} className="mb-8">
                                {/* Category title */}
                                <div className="mb-2 text-left">
                                    <div className="text-lg font-semibold text-gray-800">
                                        ₹{cat.price} {cat.name}
                                    </div>
                                </div>

                                <div className="mb-4 w-full">
                                    <hr className="border-gray-300" />
                                </div>

                                {/* Seat rows */}
                                {cat.rows.map((row) => (
                                    <div key={row} className="mb-3">
                                        <div className="grid grid-cols-10 gap-3 justify-items-center">
                                            {[...Array(10)].map((_, i) => {
                                                const seat = `${row}${i + 1}`;
                                                const isSelected = selectedSeats.some((s) => s.seat === seat);

                                                return (
                                                    <button
                                                        key={seat}
                                                        onClick={() => toggleSeat(seat, cat.price)}
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
                                ))}
                            </div>
                        ))}

                        {/* Screen */}
                        <div className="flex flex-col items-center mt-8">
                            <div className="w-full">
                                <div className="h-2 bg-gray-400 rounded-md" />
                            </div>
                            <p className="text-sm text-gray-600 mt-2 text-center">
                                All eyes this way please!
                            </p>
                        </div>

                        {/* Underline before pay */}
                        <div className="w-full my-6">
                            <hr className="border-gray-300" />
                        </div>

                        {/* Pay button */}
                        <div className="flex justify-center">
                            <button
                                onClick={()=>navigate('/bookingdetails')}
                                disabled={selectedSeats.length === 0}
                                className={`px-20  py-3 font-poppins rounded-lg font-semibold transition border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white `}
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
