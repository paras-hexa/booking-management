import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";

function autoSelectSeats(enrichedLayout, bookedSeats, count) {
    let bestGroup = [];
    let allAvailable = [];
   console.log("booked in fun" , bookedSeats);
   
    for (const cat of enrichedLayout) {
        const { layout, excludedRows = [], excludedSeats = [], excludedColumns = [], price = 0, type } = cat;
        const [startCol, endCol] = layout.columns;
        const columns = Array.from({ length: endCol - startCol + 1 }, (_, i) => i + startCol);

        // Expand rows properly (A..D etc)
        const [startRow, endRow] = layout.rows;
        const rows = [];
        for (let c = startRow.charCodeAt(0); c <= endRow.charCodeAt(0); c++) {
            rows.push(String.fromCharCode(c));
        }

        for (const row of rows) {
            if (excludedRows.includes(row)) continue;

            let currentGroup = [];

            for (const col of columns) {
                const seat = `${row}${col}`;
                const blocked =
                    excludedSeats.includes(seat) ||
                    excludedColumns.includes(col) ||
                    bookedSeats.has(seat);

                if (!blocked) {
                    const seatObj = { seat, price, type };
                    allAvailable.push(seatObj);

                    currentGroup.push(seatObj);
                    if (currentGroup.length === count) return currentGroup; // exact match
                } else {
                    if (currentGroup.length > bestGroup.length) bestGroup = [...currentGroup];
                    currentGroup = [];
                }
            }

            if (currentGroup.length > bestGroup.length) bestGroup = [...currentGroup];
        }
    }

    // 1st priority: inline match
    if (bestGroup.length) return bestGroup;

    // 2nd priority: first N available anywhere
    return allAvailable.slice(0, count);
}



export const Seatmap = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const theater = location.state.theater;
    const movie = location.state.movie;
    const count = location.state.seats;
    const showtimeID = location.state.showtimeID;
    console.log("sh id", showtimeID);

    const [seatLayout, setSeatLayout] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState(new Set());
    // const [bookedSeats, setBookedSeats] = useState([]);

    useEffect(() => {
        async function fetchLayout() {
            try {
                // Step 1: fetch showtime to get screenId
                const resShowtime = await api.get(`/show-times/${showtimeID}`, {
                    headers,
                });

                let parsedLayout = resShowtime.data.data.screen.layout

                console.log("before", parsedLayout);
                console.log("after", JSON.parse(parsedLayout));


                if (typeof (parsedLayout) === "string") {
                    try {
                        parsedLayout = JSON.parse(parsedLayout);
                    } catch (e) {
                        console.error("Invalid layout JSON:", e);
                        parsedLayout = [];
                    }
                }




                const priceMap = {};

                if (resShowtime.data.data?.price) {
                    resShowtime.data.data.price.forEach((p) => {
                        console.log(p);

                        priceMap[p.layoutType] = p.price;
                    });
                }



                // Step 5: merge price into layout
                const enrichedLayout = parsedLayout.map((cat) => ({
                    ...cat,
                    price: priceMap[cat.type] || priceMap.Premium,
                }));

                setSeatLayout(enrichedLayout);

                // Step 6: mark booked seats
                const orders = resShowtime.data.data.orders
                // const booked = [];
                // orders.forEach((ord)=>{
                //   ord.seatData?.seats?.forEach((s)=>{
                //     booked.push(`${s.row}${s.column}`)
                //   })
                // })
                 
                // setBookedSeats(booked);
                const nextBlocked = new Set();

                // Handle different shapes: array of strings OR array of {row,column}
                const fromShowtime = orders ?? [];
                fromShowtime.forEach(seat => {
                    if (typeof seat === 'string') {
                        nextBlocked.add(seat);                 // e.g. "A1"
                    } else if (seat?.row && seat?.column != null) {
                        nextBlocked.add(`${seat.row}${seat.column}`);
                    }
                });
                
                // 2) Active Orders (treat PENDING + SUCCESS as blocked)
                // If your backend supports these query params, use them:
                const ordRes = await api.get('/orders', {
                    headers,
                    params: { showtimeId: showtimeID, status: 'PENDING,COMPLETED' }
                });

                console.log(ordRes);
                 

                (ordRes.data ?? []).forEach(o => {
                    // Fallback: if backend ignores params, filter here:
                    if (o.showtimeId !== showtimeID) return;
                    if (!['PENDING', 'SUCCESS'].includes(o.status)) return;

                    o.seatData?.seats?.forEach(s => {
                        if (s?.row && s?.column != null) {
                            nextBlocked.add(`${s.row}${s.column}`);
                        }
                    });
                });

                setBookedSeats(nextBlocked);
                                 console.log("ordeer" , orders , bookedSeats);

                 console.log(bookedSeats , "book seat is ready now you can call auto select");
                 
                // Auto pre-select seats inline (first N available seats)               
                if (count > 0) {
                    const autoSeats = autoSelectSeats(enrichedLayout, bookedSeats, count);
                    setSelectedSeats(autoSeats);
                    console.log("Auto selected:", autoSeats);
                }

            } catch (err) {
                console.error("Error fetching layout:", err);
            }
        }


        fetchLayout();
    }, [showtimeID]);
    console.log("sl", seatLayout);

    const toggleSeat = (seat, price, type) => {
        if (bookedSeats.has(seat)) return;

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
                const updated = [...selectedSeats.slice(1), { seat, price, type }];
                setSelectedSeats(updated);
            }
        }
    };
    console.log("seat Layout", seatLayout);


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
                            const columns = Array.from(
                                { length: endCol - startCol + 1 },
                                (_, i) => i + startCol
                            );

                            const [startRow, endRow] = layout.rows;
                            const rows = Array.from(
                                { length: endRow.charCodeAt(0) - startRow.charCodeAt(0) + 1 },
                                (_, i) => String.fromCharCode(startRow.charCodeAt(0) + i)
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
                                    {rows.map((row) => {
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
                                                   
                                                        const isBooked = bookedSeats.has(seat);

                                                        return (
                                                            <button
                                                                key={seat}
                                                                disabled={isBooked}
                                                                onClick={() => toggleSeat(seat, price, type)}
                                                                className={`w-4 h-4 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-md border text-xs sm:text-sm flex items-center justify-center transition
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
                                        state: { ...location.state, selectedSeats, totalPrice },
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