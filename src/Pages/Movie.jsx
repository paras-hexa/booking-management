import { useState , useEffect } from "react";
import { Card } from "../Components/Movie-Card";
import { api } from "../api/axiosInstance";
import { headers } from "../constant";
export const Movie = () => {
 const [Movies, setMovies] = useState([])

 async function fetchmovie(){
    try {
      const res = await api.get('/movies' , {
        headers:headers
      })
      setMovies(res.data)
    } catch (error) {
      
    }
 }

   useEffect(() => {
     fetchmovie()
   }, [])
   
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {Movies.map((m) => (
        <Card key={m.id} id={m.id} image={m.image} name={m.name} />
      ))}
    </div>
  );
};

