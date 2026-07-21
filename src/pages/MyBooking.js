// src/pages/MyBooking.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCalendarDays,
  FaClock,
  FaUsers,
  FaChair,
  FaMessage,
} from "react-icons/fa6";
import PublicLayout from "../components/PublicLayout";

const MyBooking = () => {
  const BASE_URL = "https://softworktech.com/asad_ecom";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= GET MY BOOKING =================
  const fetchMyBookings = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/table/my-booking/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (error) {
      console.log(error.response?.data);
      alert("Booking load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return (
    <PublicLayout>
      <div className="container py-5 mt-5">
        <h1 className="fw-bold text-center mb-5">My Bookings</h1>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-warning"></div>
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="card shadow rounded-4 p-5 text-center">
            <h4>No Booking Found</h4>
            <p className="text-muted">You have not booked any table yet.</p>
          </div>
        )}

        <div className="row g-4">
          {bookings.map((booking) => (
            <div className="col-md-4" key={booking.id}>
              <div className="card shadow rounded-4 p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning-subtle rounded-circle p-3">
                    <FaChair size={30} />
                  </div>

                  <h4 className="ms-3 mb-0">
                    Table{" "}
                    {booking.table?.table_number ||
                      booking.table_number ||
                      "Unknown"}
                  </h4>
                </div>

                <p>
                  <FaCalendarDays className="text-warning" />
                  &nbsp;
                  <b>Date:</b>
                  &nbsp;
                  {booking.booking_date}
                </p>

                <p>
                  <FaClock className="text-warning" />
                  &nbsp;
                  <b>Time:</b>
                  &nbsp;
                  {booking.booking_time}
                </p>

                <p>
                  <FaUsers className="text-warning" />
                  &nbsp;
                  <b>Guest:</b>
                  &nbsp;
                  {booking.guest_number}
                </p>

                <p>
                  <FaMessage className="text-warning" />
                  &nbsp;
                  <b>Request:</b>
                  <br />
                  {booking.special_request
                    ? booking.special_request
                    : "No request"}
                </p>

                <span
                  className={`badge rounded-pill px-3 py-2 ${
                    booking.status === "confirmed"
                      ? "bg-success"
                      : booking.status === "cancelled"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}
                >
                  {booking.status || "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default MyBooking;