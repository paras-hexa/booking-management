import { TicketCard } from "../Components/Ticket-Card";

export const TicketsList = ({ type }) => {
  console.log(type);
  
  const allTickets = [
    { id: 1, date: "2025-10-01", movie: "Batman", seats: ["C1","C2"], time: "15:00", status: "upcoming" },
    { id: 1, date: "2025-10-01", movie: "Batman", seats: ["C1","C2"], time: "15:00", status: "upcoming" },
    { id: 2, date: "2025-07-15", movie: "Superman", seats: ["A1","A2"], time: "18:00", status: "history" },
    { id: 2, date: "2025-07-15", movie: "Superman", seats: ["A1","A2"], time: "18:00", status: "history" },
    { id: 2, date: "2025-07-15", movie: "Superman", seats: ["A1","A2"], time: "18:00", status: "history" },
 
  ];

  const upcomingtickets = allTickets.filter((t) => t.status === "upcoming");
  ;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {
       type==="history" ? 
        allTickets.map((t) => (
        <TicketCard key={t.id} {...t} />
      ))
       : upcomingtickets.map((t)=>{
       return <TicketCard key={t.id} {...t}/>
      }) }
    </div>
  );
};

