import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api';

import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    try {
      const res = await api.post('/auth/login', {
        email, password
      });
      if (!res.data || !res.data.user) {
        alert("Invalid server response");
        return;
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      setMessage(`Welcome ${res.data.user.name}, Role: ${res.data.user.role}`);
      alert("Successfully Logged In");
      console.log("=== FRONTEND LOGIN DEBUG ===");
      console.log("Full API response:", res.data);
      console.log("User object from API:", res.data.user);
      console.log("Role from API response:", res.data.user.role);
      console.log("Role type:", typeof res.data.user.role);
      console.log("Role value:", JSON.stringify(res.data.user.role));

      // Handle null/undefined roles
      let userRole = "user"; // default fallback

      if (res.data.user.role !== null && res.data.user.role !== undefined && res.data.user.role !== '') {
        userRole = res.data.user.role;
        console.log("✅ Using role from API:", userRole);
      } else {
        console.log("❌ Role not found or empty in API, using default:", userRole);
      }

      console.log("🔄 Final role for navigation:", userRole);
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (res.data.user.role === "user") {
        navigate("/user/dashboard");
      } else if (res.data.user.role === "store_owner") {
        navigate("/owner/dashboard");
      }


    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
      console.error(err);
    }
    console.log('Logging in with', email, password);
  }
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100'>
      <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center text-green-800 mb-6'>Login Page</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Username:</label>
            <input type="email" placeholder="Username" className='w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500' value={email} onChange={(e) => setemail(e.target.value)} required />
          </div>

            <label className="block text-sm font-medium text-gray-700">Password:</label>

            <input type="password" className="w-full mt-1 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Login</button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">Don't have an account? <a href="/Register" className="text-blue-600 hover:underline">Register here</a></p>
      </div>
    </div>
  )
}
export default Login;