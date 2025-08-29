import { useState } from "react";

export const Tabs = ({ onTabChange }) => {
  const [active, setActive] = useState("movie");

  const handleTab = (tab) => {
    setActive(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex space-x-4 mb-6">
      <button
        className={`px-4 py-2 rounded-lg ${
          active === "movie" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleTab("movie")}
      >
        Movie
      </button>
      <button
        className={`px-4 py-2 rounded-lg ${
          active === "theater" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
        onClick={() => handleTab("theater")}
      >
        Theater
      </button>
    </div>
  );
};

