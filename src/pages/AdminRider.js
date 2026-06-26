import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";


const AdminRiderOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchOrder, setSearchOrder] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken"); // admin token
    if (!token) {
      toast.error("Please login first as admin");
      navigate("/admin-login");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        "https://softworktech.com/asad_ecom/api/admin/rider-orders/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // newest first
      const sorted = res.data.sort(
        (a, b) => new Date(b.order_time) - new Date(a.order_time)
      );
      setOrders(sorted);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    let matchesOrder = true;
    let matchesDate = true;

    if (searchOrder) {
      matchesOrder = order.order_number.toLowerCase().includes(searchOrder.toLowerCase());
    }

    if (searchDate) {
      matchesDate = order.order_time?.slice(0,10) === searchDate;
    }

    return matchesOrder && matchesDate;
  });

  return (

     <AdminLayout>
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Rider Orders</h2>

      {/* FILTER */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Order Number"
          className="border p-2 rounded"
          value={searchOrder}
          onChange={(e) => setSearchOrder(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white shadow rounded p-4">
        {loading ? (
          <p>Loading...</p>
        ) : filteredOrders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <table className="table-auto w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">SL</th>
                <th className="border p-2">Order #</th>
                <th className="border p-2">Food</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Rider</th>
                <th className="border p-2">Mobile</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Order Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{order.order_number}</td>
                  <td className="border p-2">{order.food_name}</td>
                  <td className="border p-2">{order.quantity}</td>
                  <td className="border p-2">{order.address}</td>
                  <td className="border p-2">{order.rider_name}</td>
                  <td className="border p-2">{order.rider_mobile}</td>
                  <td className="border p-2">{order.status}</td>
                  <td className="border p-2">{new Date(order.order_time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
   </AdminLayout>
  );
};

export default AdminRiderOrders;