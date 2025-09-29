import React, { useState, useEffect } from "react";
import api from "../../api";

function AdminUsersList() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await api.get(`/admin/users?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // load initially

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchUsers();
  };

  return (
    <div>
      <h1>Users List</h1>

      <div style={{ marginBottom: "30px" }}>
        <input type="text" name="name" placeholder="Name" value={filters.name} onChange={handleChange} />
        <input type="text" name="email" placeholder="Email" value={filters.email} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={filters.address} onChange={handleChange} />
        <select name="role" value={filters.role} onChange={handleChange}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button onClick={handleSearch}>Apply Filters</button>
      </div>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Address</th><th>Role</th>
            <th>Average Rating</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td>{u.rating !== null ? u.rating : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsersList;
