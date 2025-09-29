import React, { useState } from "react";
import api from "../../api";

function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Validation function
  const validate = ({ name, email, password, address }) => {
    const errors = {};

    // Name check
    if (name.length < 20 || name.length > 60) {
      errors.name = "Name must be between 3 and 60 characters.";
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Invalid email format.";
    }

    // Password check
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // Clear previous errors

    try {
      const res = await api.post("/admin/add-user", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
      setForm({ name: "", email: "", address: "", password: "", role: "user" }); // Clear form
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding user");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Add User</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            maxLength={400}
            required
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add User
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}

export default AddUser;
