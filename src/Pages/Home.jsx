import { NavLink, Outlet } from "react-router-dom";
import { Navbar } from "../Components/Navbar";
export const Home = () => {
    return (
        <div className="min-h-screen bg-corner-glow">
           <Navbar/>
            <div className="px-5 py-6 max-w-6xl mx-auto">

                <h1 className="text-4xl font-bold mb-6 text-blue-600">Now Showing</h1>

                {/* Sub-navigation for Movie/Theater */}
                <div className="flex space-x-4 mb-6">
                    <NavLink
                        to="/home"
                        end
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg font-medium ${isActive
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600 border border-blue-600"
                            }`
                        }
                    >
                        Movie
                    </NavLink>

                    <NavLink
                        to="/home/theater"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg font-medium ${isActive
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600 border border-blue-600"
                            }`
                        }
                    >
                        Theater
                    </NavLink>
                </div>

                {/* Body changes with nested routes */}
                <div className="h-[70vh] overflow-y-auto pr-2" >
                     <Outlet />
                </div>
               
            </div>
        </div>
    );
};

