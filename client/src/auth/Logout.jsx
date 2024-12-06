import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate()
  if(token){
    logout()
  }
  useEffect(() => {
    const handleLogout = async () => {
      if (!token) {
        navigate('/auth/login')
      }
    };
    handleLogout();
  }, [token]);
  return <div>Logging you out</div>;
}
