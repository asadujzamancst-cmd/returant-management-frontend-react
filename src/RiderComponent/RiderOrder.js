import React, { useEffect, useState } from "react";
import RiderLayout from "./RiderLayout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const RiderOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [riderId, setRiderId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("riderToken"); // ✅ FIX
    const role = localStorage.getItem("role");

    if (!token || role !== "rider") {
      toast.error("Please login first");
      return;
    }

    // ✅ rider_id directly from localStorage (no extra API call needed)
    const storedRiderId = localStorage.getItem("rider_id");

    if (!storedRiderId) {
      toast.error("Rider ID not found");
      return;
    }

    setRiderId(storedRiderId);
    fetchOrders(token);
  }, []);

  const fetchOrders = (token) => {
    setLoading(true);

    axios
      .get("https://softworktech.com/asad_ecom/api/rider/ready-orders/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  const assignOrder = async () => {
    try {
      const token = localStorage.getItem("riderToken"); // ✅ FIX

      const res = await axios.post(
        "https://softworktech.com/asad_ecom/api/rider/auto-assign-order/",
        { rider_id: riderId }, // ✅ correct use
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data.message);

      fetchOrders(token); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to assign order");
    }
  };

  return (
    <div>
      <div className="p-4 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">Ready Orders</h2>

        {loading && <p>Loading...</p>}

        {orders.length === 0 && !loading && <p>No orders available.</p>}

        {orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2 py-1">SL</th>
                  <th className="border px-2 py-1">Order #</th>
                  <th className="border px-2 py-1">User Email</th>
                  <th className="border px-2 py-1">Address</th>
                  <th className="border px-2 py-1">Order Time</th>
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id}> {/* ✅ key ঠিক আছে */}
                    <td className="border px-2 py-1">{idx + 1}</td>
                    <td className="border px-2 py-1">{order.order_number}</td>
                    <td className="border px-2 py-1">{order.user_email}</td>
                    <td className="border px-2 py-1">{order.address}</td>
                    <td className="border px-2 py-1">
                      {new Date(order.order_time).toLocaleString()}
                    </td>
                    <td className="border px-2 py-1 space-x-2">
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700" // ✅ CSS fix
                        onClick={() => assignOrder(order.id)}
                      >
                        Pickup
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RiderOrder;