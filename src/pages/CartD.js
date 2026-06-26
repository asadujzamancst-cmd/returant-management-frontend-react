import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const CartD = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0);
  const token = localStorage.getItem("userToken");

  // Helper: Get correct price based on offer
  const getItemPrice = (item) => {
    if (item.offer_active || item.offer_active_manual) {
      return Number(item.discounted_price);
    }
    return Number(item.price);
  };

  // Calculate grand total
  const calculateGrandTotal = (items) =>
    items.reduce(
      (sum, item) => sum + getItemPrice(item) * Number(item.quantity || 1),
      0
    );

  // Fetch cart items
  const fetchCart = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("https://softworktech.com/asad_ecom/api/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        navigate("/login-user");
        return;
      }

      const data = await res.json();
      setCartItems(data);
      setGrandTotal(calculateGrandTotal(data));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // Update quantity (optimistic)
  const handleQuantityChange = async (orderId, newQuantity) => {
    if (newQuantity < 1) {
      toast.warning("Quantity cannot be less than 1");
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === orderId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    setGrandTotal(calculateGrandTotal(updatedItems));

    try {
      const res = await fetch("https://softworktech.com/asad_ecom/api/cart/update_quantity/", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId, quantity: newQuantity }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Quantity updated");
        window.dispatchEvent(new Event("cart-update"));
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  // Remove item (optimistic)
  const handleRemove = async (orderId) => {
    if (!window.confirm("Remove this item?")) return;
    if (!token) return;

    const updatedItems = cartItems.filter((item) => item.id !== orderId);
    setCartItems(updatedItems);
    setGrandTotal(calculateGrandTotal(updatedItems));

    try {
      const res = await fetch(`https://softworktech.com/asad_ecom/api/cart/remove/${orderId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Item removed");
        window.dispatchEvent(new Event("cart-update"));
      } else {
        toast.error(data.error || "Failed to remove item");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (loading)
    return (
      <PublicLayout>
        <div className="text-center py-5">Loading...</div>
      </PublicLayout>
    );

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <h3 className="mb-5 text-center text-primary fw-bold">My Cart</h3>

        {cartItems.length === 0 ? (
          <div className="text-center py-5 bg-white shadow-sm rounded">
            <p className="fs-5">Your cart is empty.</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Order Now
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              {cartItems.map((item) => {
                const itemPrice = getItemPrice(item);
                return (
                  <div
                    key={item.id}
                    className="card mb-3 shadow-sm border-0 hover-shadow"
                    style={{ transition: "0.3s" }}
                  >
                    <div className="row g-0 align-items-center p-3">
                      <div className="col-3">
                        <img
                          src={item.food_image || "https://via.placeholder.com/100"}
                          alt={item.food_name}
                          className="img-fluid rounded"
                          style={{ maxHeight: "100px", objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-5 ps-3">
                        <h6 className="mb-1">{item.food_name}</h6>

                        {item.offer_active || item.offer_active_manual ? (
                          <p className="mb-1">
                            <span className="text-decoration-line-through text-muted me-2">
                              ${Number(item.price).toFixed(2)}
                            </span>
                            <span className="fw-bold text-danger">
                              ${Number(item.discounted_price).toFixed(2)}
                            </span>
                          </p>
                        ) : (
                          <p className="mb-1 text-muted">${Number(item.price).toFixed(2)}</p>
                        )}

                        {item.offer_end && (
                          <small className="text-danger d-block">
                            Offer ends: {new Date(item.offer_end).toLocaleString()}
                          </small>
                        )}

                        <p className="mb-0 text-muted">
                          Subtotal: ${(itemPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="col-4 text-end">
                        <div className="d-flex justify-content-end align-items-center mb-2">
                          <button
                            className="btn btn-light btn-sm me-2"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <FaMinus />
                          </button>
                          <span className="px-2 badge bg-secondary">{item.quantity}</span>
                          <button
                            className="btn btn-light btn-sm ms-2"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                        <button
                          className="btn btn-danger btn-sm w-100"
                          onClick={() => handleRemove(item.id)}
                        >
                          <FaTrash className="me-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="col-lg-4">
              <div className="card p-4 shadow-sm border-0 sticky-top" style={{ top: "80px" }}>
                <h5 className="mb-3">Order Summary</h5>
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Items:</span>
                  <span className="fw-bold">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Grand Total:</span>
                  <span className="fw-bold text-primary">${grandTotal.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-primary w-100 fw-bold"
                  onClick={() => navigate("/payment", { state: { amount: grandTotal } })}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover shadow effect */}
      <style>{`
        .hover-shadow:hover {
          box-shadow: 0 0 15px rgba(0,0,0,0.2);
        }
      `}</style>
    </PublicLayout>
  );
};

export default CartD;