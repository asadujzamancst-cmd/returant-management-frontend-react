import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    reg_date: "",
  });

  // 🔹 JWT token from localStorage
  const token = localStorage.getItem("userToken");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.warning("Please login to view profile");
      navigate("/login-user");
    }
  }, [token, navigate]);

  // Fetch profile using token
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/user/profile/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("userToken");
          navigate("/login-user");
          return;
        }

        const data = await res.json();
        setformdata(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/profile/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Profile updated successfully!");
      } else if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("userToken");
        navigate("/login-user");
      } else {
        toast.error(data.error || "Update failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error.");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container py-5">
        <h3 className="mb-4">My Profile</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              className="form-control"
              value={formdata.first_name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              className="form-control"
              value={formdata.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formdata.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Mobile</label>
            <input
              type="text"
              name="mobile"
              className="form-control"
              value={formdata.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Reg Date</label>
            <input
              type="text"
              className="form-control"
              value={
                formdata.reg_date
                  ? new Date(formdata.reg_date).toLocaleString()
                  : ""
              }
              readOnly
            />
          </div>

          <button className="btn btn-primary">
            <i className="fas fa-save me-2"></i>Update Profile
          </button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default Profile;
