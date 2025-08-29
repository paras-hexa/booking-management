import { MapPin } from "lucide-react"; // icon library

export const TheaterCard = ({ name, location }) => {
  return (
    <div className="p-5 rounded-xl border border-gray-500 bg-transparent  hover:bg-gradient-to-r hover:from-blue-200 hover:to-transparent  transition">
      {/* Cinema Name */}
      <h3 className="text-xl font-bold text-blue-600">{name}</h3>

      {/* Location */}
      <div className="flex items-center mt-1 text-sm text-gray-600">
        <MapPin size={16} className="mr-1 text-gray-500" />
        <span>{location}</span>
      </div>
    </div>
  );
};
