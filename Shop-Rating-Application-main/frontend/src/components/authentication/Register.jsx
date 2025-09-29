import React, { useState } from "react";
import api from "../../api";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState("user"); // default
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Validation function
  const validate = ({ name, email, password, address }) => {
    const errors = {};

    // Name check (more reasonable length)
    if (name.length < 20 || name.length > 60) {
      errors.name = "Name must be between 20 and 60 characters.";
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Invalid email format.";
    }

    // Password check: 8–16 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be 8–16 characters, include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.";
    }

    // Address check
    if (address.length > 400) {
      errors.address = "Address cannot exceed 400 characters.";
    }

    return errors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate({ name, email, password, address });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // clear previous errors

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        address,
        role
      });
      setMessage(res.data.message);
      alert("Successfully Registered");
      console.log(res);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Register Page</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-gray-700 font-medium mb-1">Username:</label>
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <label className="block text-gray-700 font-medium mb-1">Email:</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <label className="block text-gray-700 font-medium mb-1">Password:</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <label className="block text-gray-700 font-medium mb-1">Address:</label>
          <input
            type="text"
            placeholder="Address"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        {message && <p className="mt-4 text-center text-green-600">{message}</p>}

        <p className="mt-4 text-center text-sm text-gray-600">
          Want to Login?{" "}
          <a className="text-blue-600 font-semibold hover:underline" href="/">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
