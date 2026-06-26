import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const AdminRiderManagement = () => {
  const navigate = useNavigate();
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH RIDERS ----------------
  const fetchRiders = async () => {
    const token = localStorage.getItem("adminToken"); // admin token
    if (!token) {
      navigate("/admin-login");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/riders/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRiders(res.data);
    } catch (err) {
      toast.error("Failed to fetch riders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  // ---------------- APPROVE RIDER ----------------
  const approveRider = async (riderId) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/admin/rider-approve/${riderId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Rider approved");
      fetchRiders();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to approve rider");
    }
  };

  // ---------------- DELETE RIDER ----------------
  const deleteRider = async (riderId) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/admin/rider-delete/${riderId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Rider deleted");
      fetchRiders();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete rider");
    }
  };

  return (
    <AdminLayout>
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Rider Management</h2>

      {loading ? (
        <p>Loading...</p>
      ) : riders.length === 0 ? (
        <p>No riders found</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">SL</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">NID</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{rider.name}</td>
                <td className="border p-2">{rider.email}</td>
                <td className="border p-2">{rider.mobile}</td>
                <td className="border p-2">{rider.nid_number}</td>
                <td className="border p-2">
                  {rider.is_approved ? "Approved" : "Pending"}
                </td>
                <td className="border p-2 flex gap-2">
                  {!rider.is_approved && (
                    <button
                      onClick={() => approveRider(rider.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteRider(rider.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    </AdminLayout>
  );
};

export default AdminRiderManagement;