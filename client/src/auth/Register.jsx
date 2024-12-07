import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();

  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formValues.password !== formValues.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (
      !formValues.first_name ||
      !formValues.last_name ||
      !formValues.username ||
      !formValues.password
    ) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const res = await register(formValues);
      if (res.data.token) {
        toast(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Error during registration.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-[500px] mx-auto p-4 bg-white border rounded ">
        <h2 className="text-2xl font-semibold mb-4 ">Register</h2>

        {/* Display error message if any */}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formValues.first_name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formValues.last_name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
