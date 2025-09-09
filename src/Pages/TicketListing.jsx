import { useEffect, useState } from "react";
import { TicketCard } from "../Components/Ticket-Card";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";

export const TicketsList = ({ type }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get("/orders", { headers });
        const orders = res.data;

        const mapped = orders.map((order) => {
          const start = new Date(order.showtime.startTime);

          return {
            id: order.id,
            date: start.toISOString().split("T")[0], // YYYY-MM-DD
            time: start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            movie: order.showtime.movie.name,
            theater: order.showtime.screen.theaterName,
            seats: order.seatData.seats.map((s) => `${s.row}${s.column}`),
            status: start > new Date() ? "upcoming" : "history",
          };
        });

        setTickets(mapped);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    }

    fetchOrders();
  }, []);

  const filtered =
    type === "history"
      ? tickets.filter((t) => t.status === "history")
      : tickets.filter((t) => t.status === "upcoming");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filtered.map((t) => (
        <TicketCard key={t.id} {...t} />
      ))}
    </div>
  );
};
