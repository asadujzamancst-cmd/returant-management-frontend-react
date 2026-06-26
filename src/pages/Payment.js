import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMode, setPaymentMode] = useState("cod");
  const [address, setAddress] = useState("");
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiry: "", cvv: "" });
  const token = localStorage.getItem("userToken");
  const userId = localStorage.getItem("userId"); // 🔹 make sure userId is saved after login

  useEffect(() => {
    if (!token || !userId) {
      toast.warning("Please login to proceed with payment");
      navigate("/login-user");
    }
  }, [token, userId, navigate]);

  const handlePlaceOrder = async () => {
    if (!address) return toast.error("Please provide a shipping address");

    if (paymentMode === "online") {
      const { cardNumber, expiry, cvv } = cardDetails;
      if (!cardNumber || !expiry || !cvv)
        return toast.error("Please fill in all card details");
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/place_order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // 🔹 send userId to backend
          address,
          paymentMode,
          ...(paymentMode === "online" ? cardDetails : {}),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        // Order successful হলে
        window.dispatchEvent(new Event("cart-update"));

        setTimeout(() => navigate("/my-order"), 2000);
      } else if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        navigate("/login-user");
      } else {
        toast.error(data.error || "Order failed");
      }
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 card shadow p-4">
            <h2 className="text-center text-primary mb-4">
              Checkout
            </h2>

            {/* Address */}
            <label className="form-label">Shipping Address</label>
            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Payment Mode */}
            <label className="form-label">Payment Method</label>
            <select
              className="form-select mb-3"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="cod">Cash on Delivery</option>
              <option value="online">Online Payment (Card)</option>
            </select>

            {/* Online Card Fields */}
            {paymentMode === "online" && (
              <div className="card-fields bg-light p-3 rounded mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                  }
                />
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, expiry: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Place Order Button */}
            <button
              className="btn btn-primary w-100 mt-2 btn-lg"
              onClick={handlePlaceOrder}
            >
              Confirm & Place Order
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Payment;
