import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { ModalProvider } from "../context/PaymentModalContext";

export default function Layout() {
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
    <ModalProvider>
      {" "}
      <div className="h-screen w-full">
        <Outlet />
      </div>
    </ModalProvider>
  );
}
