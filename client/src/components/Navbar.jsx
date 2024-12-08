import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const lastSlashIndex = pathname.lastIndexOf("/");
  const currentPageName = pathname.slice(lastSlashIndex + 1);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <nav className="w-full bg-blue-600 border-b shadow-md text-white">
      <div className="w-full mx-auto flex items-center justify-between px-6 h-[100px] [&_a]:text-white">
        <div className="header-name">
          <h1 className="capitalize">{currentPageName}</h1>
        </div>
        {/* Mobile Menu Toggle (optional) */}
        {/* <div className="md:hidden">
          <button className="text-gray-600 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div> */}

        {/* User Profile Section */}
        <div className="user-profile flex items-center space-x-3">
          <Link
            to="#"
            className="hidden md:block text-gray-600 hover:text-blue-500 transition-colors"
          >
            {user.first_name} {user.last_name}
          </Link>
          <div className="relative">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold cursor-pointer"
              onClick={toggleDropdown}
            >
              <p className="capitalize">{user.first_name.charAt(0)}</p>
            </div>

            {isDropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2">
                <div className="p-2 text-sm text-gray-700">
                  {user.first_name} {user.last_name}
                </div>
                <div className="p-2 text-sm text-gray-700">{user.role}</div>
                <button
                  className="w-full text-left p-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => navigate("/auth/logout")}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
