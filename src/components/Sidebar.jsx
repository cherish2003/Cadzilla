import React, { useState, useEffect } from "react";
import {
  HistoryIcon,
  LayoutDashboard,
  LogOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    to: "/dashboard",
  },
  {
    label: "History",
    icon: <HistoryIcon className="h-5 w-5" />,
    to: "/history",
  },
  {
    label: "Log out",
    icon: <LogOutIcon className="h-5 w-5" />,
    to: "/",
  },
];

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      if (isMobileView) {
        setIsOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen sm:h-screen bg-gray-100 ">
      <div
        className={`fixed top-0 left-0 z-20 h-full bg-white shadow-lg transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        } sm:relative sm:translate-x-0 rounded-r-lg`}
      >
        <div
          className={`flex items-center justify-between p-4 text-lg font-semibold ${
            isOpen ? "opacity-100" : "opacity-0 hidden sm:flex"
          }`}
        >
          <span>CADzilla</span>
        </div>

        <ul className="space-y-2 p-4">
          {menuItems.map(({ label, icon, to }) => (
            <li key={label}>
              <Link
                to={to}
                className={`flex items-center gap-4 rounded-md p-2 transition ${
                  location.pathname === to
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-300"
                } ${isOpen ? "justify-start" : "justify-center"}`}
              >
                {icon}
                {isOpen && (
                  <span className="text-sm font-medium transition">
                    {label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute z-50 -right-3 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg transition-all duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {isOpen ? (
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      <div
        className={`flex-1 bg-gray-100 transition-all duration-300 ${
          isOpen ? "ml-1" : "ml-4"
        }`}
      >
        <div className="p-3 h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Sidebar;
