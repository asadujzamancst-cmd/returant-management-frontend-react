import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaClock,
  FaReceipt,
  FaInfoCircle,
  FaFileInvoice,
  FaTimesCircle,
} from "react-icons/fa";
import CancelOrderModal from "../components/CancelOrderModal";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { order_number } = useParams();

  const [orderItem, setOrderItem] = useState([]);
  const [orderAddress, setOrderAddress] = useState(null);
  const [loading, setLoading] = useState(true);
   const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCloseModal = () => setShowCancelModal(false);

  const handleCancelled = () => {
    setShowCancelModal(false);
    // refresh the page or navigate to same page to see updated status
    navigate(`/order-details/${order_number}`);
  };

  // 🔒 Login check
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login-user");
    }
  }, [navigate]);

  // 📦 Fetch order data
  useEffect(() => {
    const fetchFullDetails = async () => {
      const token = localStorage.getItem("userToken");

      try {
        // Items
        const resItems = await fetch(
          `https://softworktech.com/asad_ecom/api/order/by_order_number/${order_number}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (resItems.status === 401) {
          navigate("/login-user");
          return;
        }

        const dataItems = await resItems.json();
        setOrderItem(Array.isArray(dataItems) ? dataItems : []);

        // Address
        const resAddr = await fetch(
          `https://softworktech.com/asad_ecom/api/order_address/${order_number}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dataAddr = await resAddr.json();
        setOrderAddress(dataAddr);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (order_number) fetchFullDetails();
  }, [order_number, navigate]);

  // 💰 Total
  const calculateTotal = () => {
    return (orderItem || [])
      .reduce(
        (acc, item) =>
          acc + (parseFloat(item.food?.price || 0) * Number(item.quantity)),
        0
      )
      .toFixed(2);
  };

  // 🧾 Invoice Open With Token
  const handleInvoice = async () => {
    const token = localStorage.getItem("userToken");

    try {
      const res = await fetch(
        `https://softworktech.com/asad_ecom/api/invoice/${order_number}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        navigate("/login-user");
        return;
      }

      const html = await res.text();

      const newWindow = window.open("", "_blank");
      newWindow.document.write(html);
      newWindow.document.close();
    } catch (err) {
      console.log(err);
      toast.error("Invoice load failed");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-primary mb-0 fw-bold">
            <FaReceipt className="me-2" />
            Order #{order_number}
          </h3>

          <Link
            to="/my-order"
            className="btn btn-outline-secondary btn-sm rounded-pill"
          >
            Back to History
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : orderItem.length === 0 ? (
          <div className="alert alert-info text-center">
            No items found for this order.
          </div>
        ) : (
          <div className="row">
            {/* LEFT */}
            <div className="col-md-8">
              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <h5 className="mb-0 fw-bold">Items Ordered</h5>
                </div>

                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th className="ps-4">Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th className="text-end pe-4">Subtotal</th>
                        </tr>
                      </thead>

                      <tbody>
                        {orderItem.map((item, index) => (
                          <tr key={index}>
                            <td className="ps-4">
                              <div className="d-flex align-items-center">
                                <img
                                  src={
                                    item.food?.image
                                      ? `https://softworktech.com/asad_ecom/${item.food.image}`
                                      : "https://via.placeholder.com/60"
                                  }
                                  alt=""
                                  className="rounded-3 me-3 shadow-sm"
                                  style={{
                                    width: "55px",
                                    height: "55px",
                                    objectFit: "cover",
                                  }}
                                />
                                <div>
                                  <p className="mb-0 fw-bold">
                                    {item.food?.item_name}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td>${item.food?.price}</td>
                            <td>{item.quantity}</td>

                            <td className="text-end pe-4 fw-bold text-primary">
                              $
                              {(
                                parseFloat(item.food?.price || 0) *
                                item.quantity
                              ).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-md-4">
              <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                  <h5 className="mb-0 fw-bold">Delivery Info</h5>
                </div>

                <div className="card-body">
                  <div className="mb-3">
                    <small className="text-muted fw-bold">
                      <FaMapMarkerAlt className="me-1" />
                      Address
                    </small>
                    <p className="mb-0">{orderAddress?.address}</p>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted fw-bold">
                      <FaInfoCircle className="me-1" />
                      Status
                    </small>
                    <p className="mb-0 fw-bold">
                      {orderAddress?.order_final_status ||
                        "Waiting for confirmation"}
                    </p>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted fw-bold">
                      <FaClock className="me-1" />
                      Order Time
                    </small>
                    <p className="mb-0">
                      {orderAddress?.order_time
                        ? new Date(orderAddress.order_time).toLocaleString()
                        : ""}
                    </p>
                  </div>
                   

                  {/* ✅ FIXED INVOICE BUTTON */}
                  <button
                    onClick={handleInvoice}
                    className="btn btn-primary w-100 rounded-pill"
                  >
                    <FaFileInvoice className="me-2" />
                    Print Invoice
                  </button>


                 {/* Cancel Order Button (show only if payment is pending) */}
{orderAddress?.order_final_status === "Pending" && (
  <>
    <button
      onClick={() => setShowCancelModal(true)}
      className="btn btn-danger w-100 rounded-pill mt-2"
    >
      <FaTimesCircle className="me-2" />
      Cancel Order
    </button>

    {/* Cancel Order Modal */}
    {showCancelModal && (
      <CancelOrderModal
        order_number={order_number}
        paymentMode={orderAddress?.payment_mode}
        onClose={handleCloseModal}
        onCancelled={handleCancelled}
      />
    )}
  </>
)}
                  
                </div>
              </div>

              {/* SUMMARY */}
              <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="card-header bg-primary text-white py-3">
                  <h5 className="mb-0 text-center">Final Summary</h5>
                </div>

                <div className="card-body bg-light">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span className="fw-bold">${calculateTotal()}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Delivery</span>
                    <span className="text-success fw-bold">FREE</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between h4 fw-bold text-primary">
                    <span>Grand Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default OrderDetails;
