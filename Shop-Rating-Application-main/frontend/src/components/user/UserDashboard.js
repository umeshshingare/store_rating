import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import UpdatePassword from "../authentication/UpdatePassword";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await api.get("/user/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  const handleRate = async (storeId, rating) => {
    try {
      await api.post(
        "/user/rate",
        { store_id: storeId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStores(); 
    } catch (err) {
      console.error(err.response?.data?.message || "Error rating store");
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        User Dashboard
      </h2>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Logout
        </button>
      <div className="flex justify-end mb-4">
        <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Update Password
      </button>
       <UpdatePassword
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      </div>


      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search stores by name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Stores Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Store Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Address
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Overall Rating
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Your Rating
              </th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {stores
              .filter(
                (s) =>
                  s.name.toLowerCase().includes(search.toLowerCase()) ||
                  s.address.toLowerCase().includes(search.toLowerCase())
              )
              .map((store) => (
                <tr
                  key={store.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{store.name}</td>
                  <td className="px-4 py-2">{store.address}</td>
                  <td className="px-4 py-2 text-yellow-600 font-semibold">
                    {Number(store.overallRating).toFixed(1)}
                  </td>
                  <td className="px-4 py-2">
                    {store.userRating || (
                      <span className="text-gray-400 italic">Not Rated</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRate(store.id, r)}
                        className={`px-2 py-1 rounded-lg text-sm font-medium ${
                          store.userRating === r
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserDashboard;
