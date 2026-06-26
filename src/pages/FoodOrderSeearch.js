import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodOrderSeearch = () => {
  const navigate = useNavigate();

  const [searchterm, setSearchterm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchterm.trim()) {
      toast.error("Please enter order number / name / mobile");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");
      const adminuser = localStorage.getItem("adminuser");

      if (!adminuser || !token) {
        navigate("/admin-login");
        return;
      }

      const res = await fetch(
        `http://127.0.0.1:8000/api/search-order/?q=${searchterm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("adminuser");
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
        return;
      }

      const data = await res.json();
      setOrders(data);

      if (data.length === 0) toast.info("No order found");
    } catch (error) {
      console.log(error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 shadow-sm rounded">
        <h2 className="text-primary mb-3">Search Order</h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-4 d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Order no / name / mobile"
            value={searchterm}
            onChange={(e) => setSearchterm(e.target.value)}
          />
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Orders Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>SL</th>
                <th>Order Number</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.order_number}</td>
                    <td>{order.order_final_status}</td>
                    <td>
                      {new Date(order.order_time).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        className="btn btn-primary btn-sm"
                        to={`/admin-view-details/${order.order_number}`}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminLayout>
  );
};

export default FoodOrderSeearch;
