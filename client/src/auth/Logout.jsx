import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      if (token) {
        await logout();
      }
      navigate("/auth/login");
    };

    handleLogout();
  }, [token, logout, navigate]);

  return <div>Logging you out...</div>;
}
