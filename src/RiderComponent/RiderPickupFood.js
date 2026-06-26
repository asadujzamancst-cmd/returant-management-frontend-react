import React, { useEffect, useState } from "react";
import RiderLayout from "./RiderLayout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const RiderOrder = () => {

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [riderId, setRiderId] = useState(null);
  const [searchOrder, setSearchOrder] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("riderToken"); // ✅ FIX
    const role = localStorage.getItem("role");

    if (!token || role !== "rider") {
      toast.error("Please login first");
      return;
    }

    // ✅ direct rider_id from localStorage
    const storedRiderId = localStorage.getItem("rider_id");

    if (!storedRiderId) {
      toast.error("Rider ID not found");
      return;
    }

    setRiderId(storedRiderId);
    fetchOrders(token);

  }, []);

  // ---------------- FETCH RIDER ORDERS ----------------

  const fetchOrders = (token) => {

    axios
      .get("https://softworktech.com/asad_ecom/api/rider/my-orders/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {

        // newest first (optional safe sort)
        const sorted = [...res.data].reverse();

        setOrders(sorted);
        setFilteredOrders(sorted);

      })
      .catch(() => toast.error("Failed to load orders"));

  };

  // ---------------- SEARCH FILTER ----------------

  useEffect(() => {

    if (!searchOrder) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((o) =>
      o.order_number.toLowerCase().includes(searchOrder.toLowerCase())
    );

    setFilteredOrders(filtered);

  }, [searchOrder, orders]);

  // ---------------- COMPLETE DELIVERY ----------------

  const completeDelivery = async (orderId) => {

    const token = localStorage.getItem("riderToken"); // ✅ FIX

    try {

      const res = await axios.post(
        `https://softworktech.com/asad_ecom/api/rider/complete-delivery/${orderId}/`,
        { rider_id: riderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);

      fetchOrders(token); // refresh

    } catch (err) {

      toast.error(err.response?.data?.error || "Delivery failed");

    }
  };

  return (

    <RiderLayout>

      <div className="p-4">

        {/* SEARCH */}

        <div className="bg-white p-4 shadow rounded mb-6">

          <input
            type="text"
            placeholder="Search Order Number"
            className="border p-2 rounded w-full"
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
          />

        </div>

        {/* RIDER ORDERS */}

        <div className="bg-white shadow rounded p-4">

          <h2 className="text-xl font-bold mb-3">My Orders</h2>

          {filteredOrders.length === 0 && (
            <p>No orders assigned</p>
          )}

          {filteredOrders.length > 0 && (

            <table className="table-auto w-full border">

              <thead className="bg-gray-200">

                <tr>
                  <th className="border p-2">SL</th>
                  <th className="border p-2">Order #</th>
                  <th className="border p-2">Food</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredOrders.map((order, index) => (

                  <tr key={order.id}>

                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{order.order_number}</td>
                    <td className="border p-2">{order.food}</td>
                    <td className="border p-2">{order.quantity}</td>
                    <td className="border p-2">{order.address}</td>
                    <td className="border p-2">{order.status}</td>

                    <td className="border p-2">

                      {order.status === "pickup" && (

                        <button
                          onClick={() => completeDelivery(order.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" // ✅ FIX CSS
                        >
                          Deliver
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

      <ToastContainer position="top-right" autoClose={3000} />

    </RiderLayout>
  );
};

export default RiderOrder;