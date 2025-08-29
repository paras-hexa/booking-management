import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handlelogout = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-transparent ">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src="/movie_logo.png" alt="logo" className="h-8" />
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-8">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `pb-1 ${
              isActive
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/myticket"
          className={({ isActive }) =>
            `pb-1 ${
              isActive
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`
          }
        >
          My Ticket
        </NavLink>
      </div>

      {/* Logout (desktop only) */}
      <div className="hidden md:block">
        <button
          onClick={handlelogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Mobile Dropdown */}
      {open && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden">
          <NavLink
            to="/home"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/myticket"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `pb-1 ${
                isActive
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            My Ticket
          </NavLink>
          <button
            onClick={handlelogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
