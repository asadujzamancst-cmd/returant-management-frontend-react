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

  // ✅ Login check
  useEffect(() => {
    if (!token || !userId) {
      toast.warning("Please login to view your orders");
      navigate("/login-user");
    }
  }, [token, userId, navigate]);

  // ✅ Fetch orders
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

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

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

  // ✅ Total calculation
  const calculateOrderTotal = (items = []) => {
    return items
      .reduce(
        (acc, item) => acc + (parseFloat(item.food_price || 0) * item.quantity),
        0
      )
      .toFixed(2);
  };

  // ✅ Status color
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
          <h2 className="fw-bold text-primary mb-2">
            <FaBoxOpen className="me-2" /> My Orders
          </h2>
          <p className="text-muted">
            Manage and track your recent food orders
          </p>
        </div>

        {loading ? (
          <div className="text-center my-5 py-5">
            <div className="spinner-grow text-primary"></div>
            <p className="mt-3 text-muted">Fetching your history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5 shadow-sm bg-white rounded-4 border">
            <p className="text-muted fs-5">
              You haven't ordered anything yet!
            </p>
            <Link to="/" className="btn btn-primary rounded-pill px-4">
              Browse Delicious Menu
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
                  <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      <span className="text-uppercase text-muted small fw-bold d-block">
                        Order Reference
                      </span>
                      <span className="h5 fw-bold mb-0">
                        #{order.order_number}
                      </span>
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
                  <div className="bg-light px-4 py-2 border-bottom d-flex flex-column flex-sm-row justify-content-between gap-2">
                    <small className="text-muted">
                      <FaCalendarAlt className="me-1" />
                      {new Date(order.order_time).toLocaleDateString()}
                    </small>
                    <small
                      className="text-muted text-truncate"
                      style={{ maxWidth: "300px" }}
                    >
                      <FaTruck className="me-1" /> {order.address}
                    </small>
                  </div>

                  {/* ITEMS */}
                  <div className="card-body px-4">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center py-3 border-bottom last-child-border-0"
                      >
                        {/* ✅ FIXED IMAGE */}
                        <img
                          src={
                            item.food_image
                              ? `http://127.0.0.1:8000${item.food_image}`
                              : "https://via.placeholder.com/55"
                          }
                          alt={item.food_name}
                          className="rounded-3 shadow-sm me-3"
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "cover",
                          }}
                        />

                        {/* ✅ FIXED NAME */}
                        <div className="flex-grow-1">
                          <h6 className="mb-0 fw-bold">{item.food_name}</h6>
                          <small className="text-muted">
                            Quantity: {item.quantity}
                          </small>
                        </div>

                        {/* ✅ FIXED PRICE */}
                        <div className="text-end">
                          <span className="fw-bold">
                            $
                            {(
                              parseFloat(item.food_price || 0) *
                              item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className="card-footer bg-white border-top-0 px-4 py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <div className="d-flex align-items-center">
                      <span className="text-muted me-2">Total Paid:</span>
                      <span className="h4 mb-0 fw-bold text-primary">
                        ${calculateOrderTotal(order.items)}
                      </span>
                    </div>

                    <div className="d-flex gap-2 w-100 w-md-auto">
                      <Link
                        to={`/order-details/${order.order_number}`}
                        className="btn btn-outline-secondary flex-grow-1 rounded-pill px-3 btn-sm"
                      >
                        <FaInfoCircle className="me-1" /> Details
                      </Link>
                      <Link
                        to={`/track-order/${order.order_number}`}
                        className="btn btn-outline-primary flex-grow-1 rounded-pill px-3 btn-sm"
                      >
                        <FaMapMarkedAlt className="me-1" /> Track
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .order-card { transition: transform 0.2s ease; }
        .order-card:hover { transform: translateY(-5px); }
        .last-child-border-0:last-child { border-bottom: 0 !important; }
        @media (max-width: 576px) {
            .h4 { font-size: 1.2rem; }
        }
      `}</style>
    </PublicLayout>
  );
}

export default MyOrders;
