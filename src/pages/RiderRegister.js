import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";

const RiderRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    nid_number: "",
    password: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const res = await axios.post(
        "https://softworktech.com/asad_ecom/api/rider/register/",
        data
      );

      toast.success(res.data.message);

      setFormData({
        name: "",
        email: "",
        mobile: "",
        nid_number: "",
        password: "",
        image: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <PublicLayout>

      {/* MAIN WRAPPER */}
      <div className="register-wrapper">

        {/* LEFT FORM SECTION */}
        <div className="left-section">

          <div className="glass-card">

            <h2>Rider Registration</h2>
            <p>Create account to start delivering</p>

            <form onSubmit={handleSubmit}>

              <div className="grid">

                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="text" name="mobile" placeholder="Mobile" onChange={handleChange} required />
                <input type="text" name="nid_number" placeholder="NID Number" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="file" name="image" onChange={handleChange} required />

              </div>

              <button type="submit">Register</button>

            </form>

          </div>

        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="right-section"></div>

        <ToastContainer position="top-right" autoClose={3000} />

      </div>

      {/* STYLE */}
      <style>{`
        .register-wrapper {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: radial-gradient(circle at top, #0f172a, #020617);

        }

        /* LEFT SIDE */
        .left-section {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at center, #0b1220, #111827);
          position: relative;
          overflow: hidden;
        }

        /* RIGHT IMAGE SIDE */
        .right-section {
          flex: 1;
          width: 300px;
          height: 460px;
          border-radius: 20px;
          margin-top:70px;
          margin-left:80px;
          background: url("/images/rider.png") center/cover no-repeat;
        }

        /* GLASS CARD */
        .glass-card {
          width: 100%;
          max-width: 600px;
          padding: 30px;

          border-radius: 18px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(25px);

          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);

          color: white;
        }

        .glass-card h2 {
          text-align: center;
          margin-bottom: 5px;
        }

        .glass-card p {
          text-align: center;
          font-size: 13px;
          opacity: 0.7;
          margin-bottom: 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        input {
          padding: 10px;
          border-radius: 10px;

          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);

          color: white;
          outline: none;
        }

        input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        button {
          width: 100%;
          margin-top: 14px;
          padding: 12px;

          border: none;
          border-radius: 12px;

          background: linear-gradient(135deg, #3b82f6, #22c55e);
          color: white;

          font-weight: 600;
          cursor: pointer;

          transition: 0.3s;
        }

        button:hover {
          transform: translateY(-2px);
        }

        /* MOBILE VIEW */
        @media (max-width: 768px) {
          .right-section {
            display: none; /* 🔥 hide image on mobile */
          }

          .left-section {
            flex: 1 1 100%;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .glass-card {
            margin: 20px;
          }
        }
      `}</style>

    </PublicLayout>
  );
};

export default RiderRegister;