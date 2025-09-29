import React, { useState } from "react";
import api from "../../api";

function AddStore() {
  const [form, setForm] = useState({ name: "", email: "", address: "", owner_id: "" });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    setErrors({}); // clear previous errors
  
    try {
      const res = await api.post("/admin/add-store", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };
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

  return (
    <div>

      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700 font-medium mb-1">Store Name</label>
        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Store Name" onChange={(e) => setForm({ ...form, name: e.target.value })}  required />
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <label className="block text-gray-700 font-medium mb-1">Address</label>
        <input type="text" placeholder="Address" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" onChange={(e) => setForm({ ...form, address: e.target.value })} maxLength={400} required />
        <label className="block text-gray-700 font-medium mb-1">Owner ID (optional)</label>
        <input type="number" placeholder="Owner ID (optional)" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none" onChange={(e) => setForm({ ...form, owner_id: e.target.value })} />
        <button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition" >Add Store</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddStore;
