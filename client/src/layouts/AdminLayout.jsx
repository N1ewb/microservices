import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function UserPageLayout() {
  const {user, token} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if(token && user.role === 'admin'){
      navigate('/private/admin/dashboard')
    } else if (token) {
      navigate('/private/user/dashboard')
    } else {
      navigate('/auth/login')
    }
  },[user,token])
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="flex flex-col w-full h-full">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}
