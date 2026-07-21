import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllConfirmTable = () => {
  const BASE_URL = "https://softworktech.com/asad_ecom";

  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= GET CONFIRMED BOOKING =================
  const getConfirmedBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      let url = `${BASE_URL}/table/admin/confirmed-bookings/`;

      if (date || time) {
        url += "?";
        if (date) {
          url += `date=${date}`;
        }
        if (time) {
          url += date ? `&time=${time}` : `time=${time}`;
        }
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Confirmed booking load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConfirmedBookings();
  }, []);

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="container mt-4">
        <div className="card shadow rounded-4 p-4">
          <div className="d-flex justify-content-between mb-4">
            <h3 className="fw-bold">Confirmed Table Booking</h3>
            <button className="btn btn-dark" onClick={getConfirmedBookings}>
              Refresh
            </button>
          </div>

          {/* FILTER */}
          <div className="row mb-4">
            <div className="col-md-5">
              <label className="fw-bold">Booking Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="col-md-5">
              <label className="fw-bold">Booking Time</label>
              <input
                type="time"
                className="form-control"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-warning w-100" onClick={getConfirmedBookings}>
                Filter
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Table</th>
                  <th>Guest</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>
                        <b>{booking.user?.username}</b>
                        <br />
                        <small>{booking.user?.email}</small>
                      </td>
                      <td>
                        {booking.table_name ? booking.table_name : `Table ${booking.table}`}
                      </td>
                      <td>{booking.guest_number} Person</td>
                      <td>{booking.booking_date}</td>
                      <td>{booking.booking_time}</td>
                      <td>
                        <span className="badge bg-success">{booking.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Confirmed Booking Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllConfirmTable;
