import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserLayout() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && user.role === "admin") {
      navigate("/private/admin/dashboard");
    } else if (token) {
      navigate("/private/user/dashboard");
    } else {
      navigate("/auth/login");
    }
  }, [user, token]);
  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  );
}
