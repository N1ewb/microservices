import React from "react";
import { Outlet } from "react-router-dom";
import UnAuthNavbar from "../components/UnAuthNavbar";


export default function AuthLayout() {
  return (
    <div>
      <UnAuthNavbar />
      <Outlet />
    </div>
  );
}
