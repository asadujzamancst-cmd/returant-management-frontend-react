import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // ✅ MUST

  // ✅ login check
  useEffect(() => {
    const adminuser = localStorage.getItem("adminuser");
    const token = localStorage.getItem("adminToken");

    if (!adminuser || !token) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // ✅ function to handle 401 globally
  const handleUnauthorized = () => {
    localStorage.removeItem("adminuser");
    localStorage.removeItem("adminToken");
    toast.error("Session expired. Login again.");
    navigate("/admin-login");
  };

  // ✅ Fetch users
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    fetch("https://softworktech.com/asad_ecom/api/list_user/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          handleUnauthorized();
          throw new Error();
        }
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setAllUsers(data);
      })
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, [navigate]); // ok

  // ✅ Search
  const handleSearch = (text) => {
    const keyword = text.toLowerCase();

    if (!keyword) {
      setUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter(
      (user) =>
        user.first_name?.toLowerCase().includes(keyword) ||
        user.last_name?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword)
    );

    setUsers(filtered);
  };

const handleDelete = async (id) => {
  const token = localStorage.getItem("adminToken");

  if (!window.confirm("Are you sure you want to delete?")) return;

  try {
    const res = await fetch(`https://softworktech.com/asad_ecom/api/delete-user/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();   // ✅ read message

    if (res.status === 401) {
      handleUnauthorized();
      return;
    }

    if (!res.ok) {
      toast.error(data.message || "Delete failed");
      return;
    }

    toast.success(data.message || "Deleted successfully");

    // remove from UI
    setUsers((prev) => prev.filter((item) => item.id !== id));
    setAllUsers((prev) => prev.filter((item) => item.id !== id));
  } catch (error) {
    toast.error("Server error");
  }
};

  return (
    <AdminLayout>
      <ToastContainer />

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">Manage Users</h2>

          <CSVLink data={users} filename="users.csv" className="btn btn-success">
            Export CSV
          </CSVLink>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th width="120">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        {item.first_name} {item.last_name}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.mobile}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
