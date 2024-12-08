import { LibraryBig, LucideLayoutDashboard, FileClock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const {user} = useAuth()

  if(!user){
    return <div>Loading</div>
  }

  return (
    <aside className="w-[20%] h-screen bg-gray-100 border-r shadow-lg">
      {/* Sidebar Header */}
      <div className="px-4 h-[100px] border-b bg-blue-600 flex justify-center items-center w-full">
        <h1 className="text-xl font-bold text-white">Mock APP</h1>
      </div>

      {/* Navigation Links */}
      <nav className="p-4">
        <ul>
          <li>
            <Link
              to="/private/user/dashboard"
              className="flex items-center py-2 px-3 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
              <LucideLayoutDashboard size={24} className="mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/private/user/payments"
              className="flex items-center py-2 px-3 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
              <LibraryBig size={24} className="mr-3" />
              <span>Payment Records</span>
            </Link>
          </li>
          <li>
            <Link
              to="/private/user/reservation_history"
              className="flex items-center py-2 px-3 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
              <FileClock size={24} className="mr-3" />
              <span>Booking History</span>
            </Link>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center py-2 px-3 rounded hover:bg-blue-500 hover:text-white transition-colors"
            >
              <span>Contact</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
