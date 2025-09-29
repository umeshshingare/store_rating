import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./components/user/UserDashboard";
import OwnerDashboard from "./components/owner/ownerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
