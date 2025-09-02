import { useState , useEffect } from "react";
import { TheaterCard } from "../Components/Theater-Card";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";
import { Link } from "react-router-dom";
export const Theater = () => {
  const [theaters, settheaters] = useState([])

  async function fetchtheaters() {
    const res = await api.get('/theaters' , {
      headers:headers
    })
    console.log(res);
    settheaters(res.data.data)
  }
  useEffect(() => {
     fetchtheaters()
  }, [])
  

  return (
    <div className="grid gap-4">
      {theaters.map((t) => (
       
        <div key={t.id}>
           <Link to={`movieandtime/${t.id}`}>
            <TheaterCard id={t.id} name={t.name} location={t.location}/>
            </Link>
        </div>
        
      )) 
      
      }
        
    </div>
  );
};

