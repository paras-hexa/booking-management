import { toast } from "react-toastify";
import { downloadTicketPDF } from "../utils/downloadticket";
export const TicketCard = ({id, date, movie, seats, time }) => { 
  
  // Format date "Mon, 23 Oct 2023"
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const url = "https://static.vecteezy.com/system/resources/thumbnails/012/657/549/small_2x/illustration-negative-film-reel-roll-tapes-for-movie-cinema-video-logo-vector.jpg"
  // const handledownload = (e)=>{
  //   e.preventDefault()
  //   downloadTicketPDF(formattedDate,movie,seats,time,url)
  //   toast.success("Ticket downloaded")
  // }
  return (
    <div className="border border-blue-600 rounded-xl p-5 shadow-sm bg-transparent">
      <p className=" mb-2">
        <span className="font-semibold text-blue-600">Date</span> <br />
        {formattedDate}
      </p>

      <p className=" mb-2">
        <span className="font-semibold text-blue-600">Movie Title</span> <br />
        {movie}
      </p>

    <div className="flex justify-between">
        <p className=" mb-2">
        <span className="font-semibold text-blue-600">Ticket ({seats.length})</span> <br />
        {seats.join(", ")}
      </p>

      <p className=" mb-4">
        <span className="font-semibold text-blue-600">Hours</span> <br />
        {time}
      </p>
    </div>

      <button  onClick={() => downloadTicketPDF(id)} className="w-full font-bold border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition">
        Download Ticket
      </button>
    </div>
  );
};

