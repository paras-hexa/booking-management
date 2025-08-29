import { NavLink, Outlet } from "react-router-dom";
import { Navbar } from "../Components/Navbar";
export const Myticket = () => {
    return (
        <div className="min-h-screen bg-corner-glow">
           <Navbar/>
            <div className="px-5 py-6 max-w-6xl mx-auto">

            

                {/* Sub-navigation for Movie/Theater */}
                <div className="flex space-x-4 mb-6 mt-10">
                    <NavLink
                        to="/myticket"
                        end
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg font-medium ${isActive
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600 border border-blue-600"
                            }`
                        }
                    >
                        Upcoming
                    </NavLink>

                    <NavLink
                        to="/myticket/history"
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg font-medium ${isActive
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600 border border-blue-600"
                            }`
                        }
                    >
                        History
                    </NavLink>
                </div>

                {/* Body changes with nested routes */}
                <div className="h-[70vh] overflow-y-auto .scrollbar-hide pr-2" >
                     <Outlet />
                </div>
               
            </div>
        </div>
    );
};

