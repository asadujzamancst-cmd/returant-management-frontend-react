// src/components/AddTableModal.js

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddTableModal = ({ show, handleClose }) => {
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("available");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://softworktech.com/asad_ecom";

  const addTable = async () => {
    if (!tableNumber || !capacity) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // ✅ admin token
      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/table/admin/add-table/`,
        {
          table_number: tableNumber,
          capacity: Number(capacity),
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Table Added Successfully");

      setTableNumber("");
      setCapacity("");
      setStatus("available");

      handleClose();
    } catch (error) {
      console.log("Table Add Error:", error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Unauthorized! Admin login required");
      } else if (error.response?.status === 403) {
        toast.error("You don't have admin permission");
      } else {
        toast.error("Table add failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className="modal fade show d-block"
      style={{
        background: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4">
          <div className="modal-header">
            <h5 className="fw-bold">Add Restaurant Table</h5>

            <button className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            <label className="fw-bold">Table Number</label>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Example T1"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />

            <label className="fw-bold">Capacity</label>
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Number of seats"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />

            <label className="fw-bold">Status</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="available">Available</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>

            <button
              className="btn btn-warning fw-bold"
              onClick={addTable}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Table"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTableModal;