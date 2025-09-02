import { MapPin, ChevronRight } from "lucide-react"; // icon library

export const TheaterCard = ({ id,name, location }) => {
  return (
    <div className="p-5 rounded-xl border border-gray-300 bg-transparent hover:bg-gradient-to-r hover:from-blue-200 hover:to-transparent transition flex items-center justify-between">
      
      {/* Left: Cinema Name + Location */}
      <div>
        <h3 className="text-xl font-bold text-blue-600">{name}</h3>
        <div className="flex items-center mt-1 text-sm text-gray-600">
          <MapPin size={16} className="mr-1 text-blue-500" />
          <span>{location}</span>
        </div>
      </div>

      {/* Right: Chevron Arrow */}
      <ChevronRight size={20} className="text-blue-500" />
    </div>
  );
};
