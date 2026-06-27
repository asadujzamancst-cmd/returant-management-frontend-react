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

      if (!res.data.is_approved) {
        toast.info("Your account is pending admin approval");
        setLoading(false);
        return;
      }

      localStorage.setItem("riderToken", res.data.access);
      localStorage.setItem("riderRefresh", res.data.refresh);
      localStorage.setItem("role", "rider");
      localStorage.setItem("rider_id", res.data.rider_id);

      toast.success("Login Successful", { autoClose: 2000 });

      setTimeout(() => navigate("/rider/dashboard"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>

      <div className="login-wrapper">

        {/* LEFT SIDE (FORM) */}
        <div className="left">

          <div className="glass-card">

            <h3>Rider Login</h3>
            <p>Login to manage your deliveries</p>

            <form onSubmit={handleSubmit}>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />

              <button disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            <div className="links">
              <Link to="/rider/register">Register</Link>
              <Link to="/admin-login">Admin</Link>
            </div>

            <div className="forgot">
              <Link to="/rider-forgot-password">Forgot Password?</Link>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="right"></div>

      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* STYLE */}
      <style>{`
        .login-wrapper {
          display: flex;
          min-height: 100vh;
          background: radial-gradient(circle at top, #0f172a, #020617);
        }

        .left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .right {
          flex: 1;
          width: 300px;
          height: 460px;
          border-radius: 20px;
          margin-top:70px;
          margin-right:80px;
          background: url("/images/rider.png") center/cover no-repeat;
        }

        /* GLASS CARD */
        .glass-card {
          width: 380px;
          padding: 30px;
          border-radius: 16px;

          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(20px);

          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);

          color: white;
        }

        .glass-card h3 {
          text-align: center;
          margin-bottom: 5px;
        }

        .glass-card p {
          text-align: center;
          font-size: 13px;
          opacity: 0.7;
          margin-bottom: 15px;
        }

        .glass-card input {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;

          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.2);

          background: rgba(255,255,255,0.06);
          color: white;
          outline: none;
        }

        .glass-card input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .glass-card button {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;

          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          font-weight: 600;

          cursor: pointer;
          transition: 0.3s;
        }

        .glass-card button:hover {
          transform: translateY(-2px);
        }

        .links {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-size: 13px;
        }

        .links a {
          color: #93c5fd;
          text-decoration: none;
        }

        .forgot {
          text-align: center;
          margin-top: 10px;
          font-size: 12px;
        }

        .forgot a {
          color: #c4b5fd;
          text-decoration: none;
        }

        /* MOBILE VIEW */
        @media (max-width: 768px) {
          .right {
            display: none;
          }

          .glass-card {
            width: 95%;
          }
        }
      `}</style>

    </PublicLayout>
  );
};

export default RiderLogin;