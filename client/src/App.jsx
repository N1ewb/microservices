import "./App.css";
import Login from "./auth/Login";
import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <AuthProvider>
        <Login />
        <Dashboard />
      </AuthProvider>
    </>
  );
}

export default App;
