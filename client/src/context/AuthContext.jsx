import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../lib/api";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      return token ? jwtDecode(token) : null;
    } catch {
      return null; // Fallback if token is invalid
    }
  });

  const login = async (formValues) => {
    const { username, password } = formValues;

    if (!username || !password) {
      setError("Both fields are required!");
      return;
    }

    try {
      const response = await api.post("/login", { username, password });

      if (response.status !== 200) {
        throw new Error("Invalid credentials");
      }

      const { token } = response.data;

      localStorage.setItem("token", token);
      setToken(token);

      try {
        setUser(jwtDecode(token));
        console.log("token: ", token);
      } catch (err) {
        console.error("Failed to decode token:", err);
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
