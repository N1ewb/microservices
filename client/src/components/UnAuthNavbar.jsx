import React from "react";
import { Link } from "react-router-dom";

export default function UnAuthNavbar() {
  return (
    <nav className="w-full bg-gray-100 border-b shadow-md">
      <div className=" mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="logo text-xl font-bold text-gray-800">
          <Link to="/">My Blog</Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-links flex space-x-6">
          <Link
            to="/auth/login"
            className="text-gray-600 hover:text-blue-500 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="text-gray-600 hover:text-blue-500 transition-colors"
          >
            Register
          </Link>
          
        </div>
      </div>
    </nav>
  );
}
