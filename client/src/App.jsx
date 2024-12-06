import "./App.css";
import Login from "./auth/Login";
import { AuthProvider } from "./context/AuthContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Dashboard from "./pages/AdminPages/Dashboard";
import Layout from "./layouts/layout";
import AuthLayout from "./layouts/AuthLayout";
import Register from "./auth/Register";
import Logout from "./auth/Logout";
import AdminLayout from "./layouts/AdminLayout";
import Userdashboard from "./pages/UserPages/Userdashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/auth",
          element: <AuthLayout />,
          children: [
            {
              path: "/auth/login",
              element: <Login />,
            },
            {
              path: "/auth/register",
              element: <Register />,
            },
            {
              path: "/auth/logout",
              element: <Logout />,
            },
          ],
        },
        {
          path: "/private",
          element: <Layout />,
          children: [
            {
              path: "/private/admin",
              element: <AdminLayout />,
              children: [
                {
                  path: "/private/admin/dashboard",
                  element: <Dashboard />,
                },
              ],
            },
            {
              path: "/private/user",
              element: <AdminLayout />,
              children: [
                {
                  path: "/private/user/dashboard",
                  element: <Userdashboard />,
                },
              ],
            },
          ],
        },
      ],
    },
  ]);
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
