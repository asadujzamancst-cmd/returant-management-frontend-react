// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import "../style/Home.css";
import { Link, useNavigate,useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Track.css";
const Track = () => {
  const [OrderNumber, setOrderNumber] = useState("");
  const [trackingInfo, setTrackingInfo] = useState([]);

  const { order_number } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  // Login check
  useEffect(() => {
    if (!token) {
      toast.error("Please login first!");
      setTimeout(() => navigate("/login-user"), 1500);
    }
  }, [token, navigate]);

  // Auto load if URL has order_number
  useEffect(() => {
    if (order_number) {
      setOrderNumber(order_number);
      fetchTrackingInfo(order_number);
    }
  }, [order_number]);

  const fetchTrackingInfo = async (orderNumber) => {
    try {
      const response = await fetch(
        `https://softworktech.com/asad_ecom/api/track/${orderNumber}`
      );

      if (response.ok) {
        const data = await response.json();
        setTrackingInfo(data);
        console.log(data);
      } else {
        toast.error("Order not found");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={1000} />
      <div className="container mt-4">
        
        <h3 className="mb-4"><i className="fas fa-map-marker-alt"></i> Track Your Order</h3>
<div className="input-group mb-3 shadow-sm">
  <span className="input-group-text bg-white"><i className="fas fa-search"></i></span>
        <input
          type="text"
          placeholder="Order ID"
          className="form-control"
          value={OrderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
        />


</div>
        <button
          className="btn btn-primary track-btn"
          onClick={() => fetchTrackingInfo(OrderNumber)}
        >
          Track Order
        </button>
      </div>
      
      


    {trackingInfo.tracking?.length > 0 && (
  <div className="container mt-5">

    <h4><i className="fas fa-stream me-1"></i>
      Tracking Information for Order #
      {trackingInfo.order?.order_number}
    </h4>

    <table className="table table-bordered mt-3 shadow-sm">
      <thead className="table-light">
        <tr>
          <th>Status</th>
          <th>Remark</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {trackingInfo.tracking.map((info, index) => (
          <tr key={index}>
            <td>{info.status}</td>
            <td>{info.remark}</td>
            <td>
              {new Date(info.status_date).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>

    </table>

  </div>
)}
    </PublicLayout>
  );
};

export default Track;