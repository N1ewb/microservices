import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../lib/api";
import { toast } from "react-hot-toast";

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
      return null;
    }
  });

  const login = async (formValues) => {
    const { username, password } = formValues;

    if (!username || !password) {
      toast("Both fields are required!");
      return;
    }

    try {
      const response = await api.post("/login", { username, password });

      if (response.status !== 200) {
        toast("Invalid credentials");
      }

      const { token } = response.data;

      localStorage.setItem("token", token);
      setToken(token);

      try {
        setUser(jwtDecode(token));
      } catch (err) {
        console.error("Failed to decode token:", err);
        setUser(null);
      }
    } catch (err) {
      console.error(err);
      toast("Login failed. Please check your credentials.");
    }
  };

  const register = async (formValues) => {
    const { first_name, last_name, username, password } = formValues;

    try {
      const response = await api.post("/register", {
        first_name,
        last_name,
        username,
        password,
      });

      if (response.status === 200) {
        useToast("Registration successful:", response.data);
        localStorage.setItem("token", response.data.token);
      }
    } catch (error) {
      useToast("Error occured");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
