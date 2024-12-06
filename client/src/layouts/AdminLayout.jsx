import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function UserPageLayout() {
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
