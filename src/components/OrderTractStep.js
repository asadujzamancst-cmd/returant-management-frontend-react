import React from "react";
import "../style/OrderTrackStep.css";

const steps = [
  "Pending",
  "Order Confirm",
  "Food Ready",
  "Pickup",
  "Delivered",
];

const OrderTractStep = ({ trackingInfo }) => {
  const status =
    trackingInfo?.order?.order_final_status?.toLowerCase() || "pending";

  const currentStep =
    {
      pending: 0,
      "order confirm": 1,
      "food being ready": 2,
      pickup: 3,
      deliverd: 4,
      delivered: 4, // যদি backend Delivered পাঠায়
    }[status] ?? 0;

  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="track-container">
      <h2 className="track-title">Order Progress</h2>

      <div className="track-wrapper">
        <div className="track-line"></div>

        <div
          className="track-active-line"
          style={{ width: `${progress}%` }}
        ></div>

        {steps.map((step, index) => (
          <div className="track-step" key={index}>
            <div
              className={`track-circle ${
                index < currentStep
                  ? "completed"
                  : index === currentStep
                  ? "active"
                  : ""
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>

            <span
              className={`track-text ${
                index <= currentStep ? "active-text" : ""
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTractStep;