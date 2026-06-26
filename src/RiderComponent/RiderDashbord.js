import React, { useEffect, useState } from "react";
import RiderLayout from "./RiderLayout";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import RiderOrder from "./RiderOrder";

const RiderDashbord = () => {
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRider = async () => {
      try {
        const token = localStorage.getItem("riderToken");
        if (!token) {
          toast.error("Please login first");
          navigate("/rider/login");
          return;
        }

        const riderId = localStorage.getItem("rider_id");

          const res = await axios.get(
            `https://softworktech.com/asad_ecom/api/rider/profile/?rider_id=${riderId}`
          );
                  setRider(res.data);
        setApproved(res.data.is_approved);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load rider data. Please login again.");
        navigate("/rider/login");
      } finally {
        setLoading(false);
      }
    };

    fetchRider();
  }, [navigate]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <RiderLayout>
      <div className="container mt-4">
        {rider ? (
          approved ? (
            <div>
              <h2>Welcome, {rider.name}!</h2>
              <p><strong>Email:</strong> {rider.email}</p>
              
            </div>
          ) : (
            <div className="text-center mt-5">
              <h4>Your account is pending admin approval.</h4>
              <p>Please wait until an admin approves your account to access the dashboard.</p>
            </div>
          )
        ) : (
          <div className="text-center mt-5">
            <h4>Unable to load your data.</h4>
          </div>
        )}
        <div>
          <RiderOrder/>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </RiderLayout>
  );
};

export default RiderDashbord;