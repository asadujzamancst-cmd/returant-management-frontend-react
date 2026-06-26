import React, { useState } from "react";

const CancelOrderModal = ({ order_number, paymentMode, onClose, onCancelled }) => {
  const [remark, setRemark] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (remark.trim() === "") {
      setError("Remark is required");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `https://softworktech.com/asad_ecom/api/cancel_order/${order_number}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ remark }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        let msg = data.message || "Order cancelled successfully";

        if (paymentMode === "online payment") {
          msg += " Refund will be processed within 5-7 business days.";
        }

        setMessage(msg);

        // Optional callback to parent component
        if (onCancelled) onCancelled();

      } else {
        const data = await response.json();
        setError(data.error || "Failed to cancel order.");
      }
    } catch (err) {
      setError("An error occurred while cancelling the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cancel Order</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <p>Are you sure you want to cancel this order?</p>
            <textarea
              className="form-control"
              placeholder="Add a remark (required)"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            ></textarea>
            {error && <p className="text-danger mt-2">{error}</p>}
            {message && <p className="text-success mt-2">{message}</p>}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;