import React, { useState } from "react";
import api from "../../api";

function UpdatePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }
    try {
      const res = await api.put("/auth/update-password", {
        currentPassword,
        newPassword,
      });
      setMessage(res.data.message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Update Password
        </h2>
        {message && (
          <p className="mb-3 text-sm text-center text-red-500">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-400"
            required
          />
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePasswordModal;
