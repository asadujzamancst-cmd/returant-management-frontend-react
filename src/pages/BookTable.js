import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaCalendarDays,
  FaClock,
  FaUsers,
  FaChair,
  FaLocationDot,
} from "react-icons/fa6";

import PublicLayout from "../components/PublicLayout";

const BookTable = () => {
  const navigate = useNavigate();

  const BASE_URL = "https://softworktech.com/asad_ecom";

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  const [guestCount, setGuestCount] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ================= GET AVAILABLE TABLE =================
  const fetchTables = async () => {
    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/table/available-table/`, {
        params: {
          date: date,
          time: time,
        },
      });

      setTables(res.data);
    } catch (error) {
      console.log(error.response?.data);
      alert("Table load failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= SELECT TABLE =================
  const handleTableClick = (table) => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      alert("Please login first");
      navigate("/login-user");
      return;
    }

    setSelectedTable(table);
    setShowModal(true);
  };

  // ================= CREATE BOOKING =================
  const confirmBooking = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      navigate("/login-user");
      return;
    }

    if (!guestCount) {
      alert("Enter guest number");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/table/create-booking/`,
        {
          table: selectedTable.id,
          booking_date: date,
          booking_time: time,
          guest_number: Number(guestCount),
          special_request: specialRequest,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking Successfully");

      setShowModal(false);
      setGuestCount("");
      setSpecialRequest("");

      navigate("/my-booking");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Booking Failed");
    }
  };

  return (
    <PublicLayout>
      <div className="container py-5 mt-5">
        <h1 className="text-center fw-bold mb-3">Reserve Your Table</h1>

        <p className="text-center text-muted mb-5">Select date and time</p>

        <div className="card shadow rounded-4 p-4 mb-4">
          <div className="row g-3">
            <div className="col-md-5">
              <label className="fw-bold">
                <FaCalendarDays className="text-warning me-2" />
                Date
              </label>

              <input
                type="date"
                className="form-control mt-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="col-md-5">
              <label className="fw-bold">
                <FaClock className="text-warning me-2" />
                Time
              </label>

              <input
                type="time"
                className="form-control mt-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-warning w-100" onClick={fetchTables}>
                {loading ? "Loading..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {tables.length === 0 && (
            <div className="text-center text-muted">No table available</div>
          )}

          {tables.map((table) => (
            <div className="col-md-4" key={table.id}>
              <div
                className="card shadow rounded-4 p-4"
                style={{ cursor: "pointer" }}
                onClick={() => handleTableClick(table)}
              >
                <div className="bg-warning-subtle rounded-circle p-3 w-fit">
                  <FaChair size={35} />
                </div>

                <h3 className="mt-3 fw-bold">Table {table.table_number}</h3>

                <p>
                  <FaUsers />
                  &nbsp;
                  {table.capacity} Person
                </p>

                <p>
                  <FaLocationDot />
                  &nbsp;
                  Main Dining Area
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showModal && selectedTable && (
          <>
            <div className="modal-backdrop show"></div>

            <div className="modal d-block">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content rounded-4">
                  <div className="modal-header">
                    <h4>Confirm Booking</h4>

                    <button
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <p>
                      Table : <b>{selectedTable.table_number}</b>
                    </p>

                    <p>
                      Date : <b>{date}</b>
                    </p>

                    <p>
                      Time : <b>{time}</b>
                    </p>

                    <label className="fw-bold">Guest Number</label>
                    <input
                      type="number"
                      className="form-control"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                    />

                    <label className="fw-bold mt-3">Special Request</label>
                    <textarea
                      className="form-control"
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>

                    <button className="btn btn-warning" onClick={confirmBooking}>
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default BookTable;