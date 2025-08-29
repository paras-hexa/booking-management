import { TheaterCard } from "../Components/Theater-Card";

export const Theater = () => {
  const theaters = [
    { name: "Cinemax - Downtown", location: "Main Street" },
    { name: "IMAX - City Center", location: "Mall Road" },
    { name: "PVR - Riverside", location: "Riverfront" },

  ];
 theaters.map((t)=>{
    console.log(t);
    
 })
 

  return (
    <div className="grid gap-4">
      {theaters.map((t,i) => (
        <div key={i}>
            <TheaterCard name={t.name} location={t.location}/>
        </div>
      )) 
      
      }
        
    </div>
  );
};

