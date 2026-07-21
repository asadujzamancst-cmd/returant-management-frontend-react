// src/pages/ManageTable.js

import React, { useEffect, useState } from "react";
import axios from "axios";

import AdminLayout from "../components/AdminLayout";
import AddTableModal from "../components/AddTableModal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageTable = () => {
  const BASE_URL = "https://softworktech.com/asad_ecom";

  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [show, setShow] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const [edit, setEdit] = useState(null);

  const [search, setSearch] = useState("");

  // ================= GET TABLE =================
  const getTables = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${BASE_URL}/table/admin/manage-table/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTables(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Table load failed");
    }
  };

  // ================= GET ALL BOOKING =================
  const getBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${BASE_URL}/table/admin/all-booking/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Booking load failed");
    }
  };

  useEffect(() => {
    getTables();
    getBookings();
  }, []);

  // ================= DELETE TABLE =================
  const deleteTable = async (id) => {
    if (!window.confirm("Delete table?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`${BASE_URL}/table/admin/delete-table/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Table Deleted");
      getTables();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // ================= UPDATE TABLE =================
  const updateTable = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${BASE_URL}/table/admin/update-table/${edit.id}/`,
        {
          table_number: edit.table_number,
          capacity: edit.capacity,
          status: edit.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Table Updated");
      setEdit(null);
      getTables();
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  // ================= UPDATE BOOKING STATUS =================
  const updateBookingStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${BASE_URL}/table/update-booking-status/${id}/`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Booking ${status}`);

      getBookings();
      getTables();
    } catch (error) {
      console.log(error);
      toast.error("Booking update failed");
    }
  };

  // ================= DELETE BOOKING =================
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`${BASE_URL}/table/admin/delete-booking/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Booking Deleted");
      getBookings();
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Booking delete failed");
    }
  };

  const filtered = tables.filter((item) =>
    item.table_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <ToastContainer />

      <div className="container mt-4">
        <div className="card shadow rounded-4 p-4">
          <div className="d-flex justify-content-between mb-4">
            <h3 className="fw-bold">Manage Table</h3>

            <div>
              <button
                className="btn btn-dark me-2"
                onClick={() => setShowBooking(true)}
              >
                Booking Request
              </button>

              <button className="btn btn-warning" onClick={() => setShow(true)}>
                + Add Table
              </button>
            </div>
          </div>

          <input
            className="form-control mb-4"
            placeholder="Search Table"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Table</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((table, index) => (
                <tr key={table.id}>
                  <td>{index + 1}</td>

                  <td>{table.table_number}</td>

                  <td>{table.capacity} Person</td>

                  <td>
                    <span
                      className={
                        table.status === "available"
                          ? "badge bg-success"
                          : "badge bg-danger"
                      }
                    >
                      {table.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => setEdit(table)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTable(table.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD TABLE */}
      <AddTableModal
        show={show}
        handleClose={() => {
          setShow(false);
          getTables();
        }}
      />

      {/* EDIT TABLE MODAL */}
      {edit && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content rounded-4 p-4">
              <h4>Edit Table</h4>

              <input
                className="form-control mb-3"
                value={edit.table_number}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    table_number: e.target.value,
                  })
                }
              />

              <input
                type="number"
                className="form-control mb-3"
                value={edit.capacity}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    capacity: e.target.value,
                  })
                }
              />

              <select
                className="form-control mb-3"
                value={edit.status}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    status: e.target.value,
                  })
                }
              >
                <option value="available">Available</option>
                <option value="inactive">Inactive</option>
              </select>

              <button className="btn btn-warning" onClick={updateTable}>
                Update
              </button>

              <button
                className="btn btn-secondary mt-2"
                onClick={() => setEdit(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {showBooking && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h4>Booking Request</h4>

                <button
                  className="btn-close"
                  onClick={() => setShowBooking(false)}
                ></button>
              </div>

              <div className="modal-body">
                <table className="table">
                  <thead className="table-dark">
                    <tr>
                      <th>User</th>
                      <th>Table</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>User #{booking.user}</td>

                        <td>Table {booking.table_name}</td>

                        <td>{booking.booking_date}</td>

                        <td>{booking.booking_time}</td>

                        <td>
                          <span
                            className={
                              booking.status === "confirmed"
                                ? "badge bg-success"
                                : booking.status === "cancelled"
                                ? "badge bg-danger"
                                : "badge bg-warning"
                            }
                          >
                            {booking.status}
                          </span>
                        </td>

                        <td>
                          {booking.status === "pending" && (
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() =>
                                updateBookingStatus(booking.id, "confirmed")
                              }
                            >
                              Confirm
                            </button>
                          )}

                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() =>
                              updateBookingStatus(booking.id, "cancelled")
                            }
                          >
                            Cancel
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteBooking(booking.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageTable;