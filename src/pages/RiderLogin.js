import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RiderLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Email and password are required!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://softworktech.com/asad_ecom/api/rider/login/",
        formData
      );

      // Check if rider is approved
      if (!res.data.is_approved) {
        toast.info("Your account is pending admin approval");
        setLoading(false);
        return;
      }

      // ✅ Save tokens
localStorage.setItem("riderToken", res.data.access);
localStorage.setItem("riderRefresh", res.data.refresh);
localStorage.setItem("role", "rider");
localStorage.setItem("rider_id", res.data.rider_id);

      toast.success("Login Successful", { autoClose: 2000 });

      // Redirect after 2s
      setTimeout(() => navigate("/rider/dashboard"), 2000);
    } catch (error) {
      console.error("Rider login error:", error);
      toast.error(error.response?.data?.error || "Login failed", {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
             <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: 'url("/images/bg2.png")',
          backgroundSize: 'cover',
        }}
      >
      <div className="d-flex justify-content-center align-items-center vh-100 ">
        <div
          className="card shadow-lg p-4 rounded-4"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="card-body">
            <h3 className="card-title text-center mb-3">Rider Login</h3>
            <p className="text-center text-muted mb-4">
              Login to manage your deliveries
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <Link className="btn btn-outline-danger me-2" to="/rider/register">
                  Register
                </Link>
                <Link className="btn btn-outline-primary" to="/admin-login">
                  Admin
                </Link>
              </div>
            </form>
          </div>
          <div className="text-center mt-3">
  <Link to="/rider-forgot-password" className="text-primary">
    Forgot Password?
  </Link>
</div>
        </div>
        

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      </div>
    </PublicLayout>
  );
};

export default RiderLogin;