import { downloadTicketPDF } from "../utils/downloadticket";

export const TicketCard = ({ id, date, movie, seats, time }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="border border-blue-600 rounded-xl p-5 shadow-sm bg-transparent flex flex-col">
      {/* Top details */}
      <div className="flex-1">
        <p className="mb-2">
          <span className="font-semibold text-blue-600">Date</span> <br />
          {formattedDate}
        </p>

        <p className="mb-2">
          <span className="font-semibold text-blue-600">Movie Title</span> <br />
          {movie}
        </p>

        <div className="flex justify-between items-start gap-4">
          <p className="mb-2 break-words">
            <span className="font-semibold text-blue-600">Ticket ({seats.length})</span> <br />
            {seats.join(", ")}
          </p>

          <p className="mb-2 text-right whitespace-nowrap">
            <span className="font-semibold text-blue-600">Hours</span> <br />
            {time}
          </p>
        </div>
      </div>

      {/* Button pinned to bottom */}
      <button
        onClick={() => downloadTicketPDF(id)}
        className="mt-4 w-full font-bold border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
      >
        Download Ticket
      </button>
    </div>
  );
};
