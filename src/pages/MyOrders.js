import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaTruck,
  FaMapMarkedAlt,
  FaInfoCircle,
} from "react-icons/fa";

function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId");

  // login check
  useEffect(() => {
    if (!token || !userId) {
      toast.warning("Please login to view your orders");
      navigate("/login-user");
    }
  }, [token, userId, navigate]);

  // fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token || !userId) return;

      try {
        const res = await fetch(
          `https://softworktech.com/asad_ecom/api/ordersUser/${userId}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          localStorage.clear();
          toast.error("Session expired. Please login again.");
          navigate("/login-user");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, userId, navigate]);

  // status color
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();

    if (s?.includes("waiting") || s?.includes("pending"))
      return "bg-warning text-dark";
    if (s?.includes("confirm") || s?.includes("place"))
      return "bg-info text-white";
    if (s?.includes("cancel")) return "bg-danger";

    return "bg-success";
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">
            <FaBoxOpen className="me-2" />
            My Orders
          </h2>
          <p className="text-muted">Manage and track your recent food orders</p>
        </div>

        {loading ? (
          <div className="text-center my-5 py-5">
            <div className="spinner-grow text-primary"></div>
            <p className="mt-3 text-muted">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5 bg-white shadow-sm rounded-4 border">
            <p className="fs-5 text-muted">You haven't ordered anything yet!</p>
            <Link to="/" className="btn btn-primary rounded-pill px-4">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              {orders.map((order) => (
                <div
                  key={order.order_number}
                  className="card border-0 shadow-sm mb-4 rounded-4 overflow-hidden order-card"
                >
                  {/* HEADER */}
                  <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
                    <div>
                      <small className="text-muted">Order</small>
                      <h5 className="mb-0">#{order.order_number}</h5>
                    </div>

                    <span
                      className={`badge rounded-pill px-3 py-2 ${getStatusColor(
                        order.order_final_status
                      )}`}
                    >
                      {order.order_final_status || "Placed"}
                    </span>
                  </div>

                  {/* INFO */}
                  <div className="bg-light px-4 py-2 d-flex justify-content-between flex-wrap gap-2">
                    <small className="text-muted">
                      <FaCalendarAlt className="me-1" />
                      {new Date(order.order_time).toLocaleDateString()}
                    </small>

                    <small className="text-muted">
                      <FaTruck className="me-1" />
                      {order.address}
                    </small>
                  </div>

                  {/* ITEMS */}
                  <div className="card-body px-4">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center py-3 border-bottom"
                      >
                        <img
                          src={
                            item.food_image
                              ? `https://softworktech.com/asad_ecom${item.food_image}`
                              : "https://via.placeholder.com/55"
                          }
                          alt={item.food_name}
                          className="rounded-3 me-3"
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "cover",
                          }}
                        />

                        <div className="flex-grow-1">
                          <h6 className="mb-0 fw-bold">{item.food_name}</h6>
                          <small className="text-muted">
                            Quantity: {item.quantity}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER (PRICE REMOVED) */}
                  <div className="card-footer bg-white d-flex justify-content-end align-items-center px-4 py-3 gap-2">
                    <Link
                      to={`/order-details/${order.order_number}`}
                      className="btn btn-outline-secondary btn-sm rounded-pill"
                    >
                      <FaInfoCircle className="me-1" />
                      Details
                    </Link>

                    <Link
                      to={`/track-order/${order.order_number}`}
                      className="btn btn-outline-primary btn-sm rounded-pill"
                    >
                      <FaMapMarkedAlt className="me-1" />
                      Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .order-card {
          transition: 0.2s ease;
        }
        .order-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </PublicLayout>
  );
}

export default MyOrders;