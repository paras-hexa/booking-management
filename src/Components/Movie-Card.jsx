import { Link } from "react-router-dom";

export const Card = ({ id ,image, name }) => {
  
  return (
    <div className="relative w-48 flex flex-col items-center">
      {/* Movie Poster */}
      <Link to={`/home/movie/placeandtime/${id}`}>
      <div className="w-44 h-64 rounded-xl overflow-hidden ">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-xl transform transition-transform duration-100 hover:scale-110"
        />
      </div>

      {/* Title */}
      <h3 className="mt-3 text-center text-base font-semibold text-blue-700 transition-colors hover:text-blue-900">
        {name}
      </h3>
      </Link>
    </div>
  );
};
