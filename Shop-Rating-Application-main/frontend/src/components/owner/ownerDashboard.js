import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import UpdatePassword from "../authentication/UpdatePassword";

function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({});
  const token = localStorage.getItem("token");
    const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get("/store/my-stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(res.data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };
    fetchStores();
  }, [token]);

  const fetchRatings = async (storeId) => {
    try {
      const res = await api.get(`/store/${storeId}/ratings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings((prev) => ({ ...prev, [storeId]: res.data }));
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Store Owner Dashboard
      </h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {store.name}
            </h3>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Email:</span> {store.email}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Address:</span> {store.address}
            </p>
            <p className="text-gray-600 mb-3">
              <span className="font-medium">Overall Rating:</span>{" "}
              {Number(store.overallRating).toFixed(1)} ({store.totalRatings} ratings)
            </p>
            <button
              onClick={() => fetchRatings(store.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              View Ratings
            </button>

            {ratings[store.id] && (
              <ul className="mt-4 space-y-2">
                {ratings[store.id].map((r, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-50 p-2 rounded-md border border-gray-200"
                  >
                    <span className="font-medium">{r.userName}</span> (
                    {r.email}) rated: <span className="font-semibold">{r.rating}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OwnerDashboard;

