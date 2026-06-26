import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Changepassword = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const [formdata, setformdata] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  // get user id
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (!storedId || storedId === "undefined" || storedId === "null") {
      navigate("/login-user");
    } else {
      setUserId(storedId);
    }
  }, [navigate]);

  // input change
  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formdata.new_password !== formdata.confirm_password) {
      toast.error("New password & confirm password not match");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/user/change-password/${userId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formdata),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully!");
        setformdata({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      } else {
        toast.error(data.error || "Failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container py-5" style={{ maxWidth: "500px" }}>
        <h3 className="mb-4">Change Password</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Old Password</label>
            <input
              type="password"
              name="old_password"
              className="form-control"
              value={formdata.old_password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              className="form-control"
              value={formdata.new_password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              className="form-control"
              value={formdata.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-danger w-100">
            Change Password
          </button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default Changepassword;
