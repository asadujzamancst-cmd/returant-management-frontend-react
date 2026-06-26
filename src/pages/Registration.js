// src/pages/Registration.jsx
import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    password: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // 🔹 সার্ভার থেকে HTML এরর (৫০০) আসলে সেটি হ্যান্ডেল করা
      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        throw new Error("Server returned non-JSON response. Check your Backend.");
      }

      if (res.ok) {
        toast.success(data.message || 'Registration successful!', {
          position: "top-right",
          autoClose: 2000,
        });

        // ফর্ম ক্লিয়ার করা
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          mobile: '',
          password: '',
        });

        // ২ সেকেন্ড পর লগইন পেজে পাঠানো
        setTimeout(() => navigate('/login-user'), 2000);

      } else {
        // ডুপ্লিকেট ইমেইল বা মোবাইলের জন্য এরর মেসেজ
        toast.error(data.message || 'Registration failed!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error(err.message || 'An error occurred. Try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <PublicLayout>
             <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: 'url("/images/backgrounu.png")',
          backgroundSize: 'cover',
        }}
      >
      <div className="container py-5">
        <h2 className="mb-4 text-center text-white">User Registration</h2>

        <form
          onSubmit={handleSubmit}
          className="mx-auto shadow p-4 rounded bg-white"
          style={{ maxWidth: '500px' }}
        >
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="first_name"
                className="form-control"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="form-control"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              className="form-control"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="017XXXXXXXX"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
            REGISTER NOW
          </button>
          
          <p className="text-center mt-3">
            Already have an account? <span 
              className="text-primary cursor-pointer" 
              style={{cursor: 'pointer'}} 
              onClick={() => navigate('/login-user')}
            >Login here</span>
          </p>
        </form>

        <ToastContainer />
      </div>
      </div>
    </PublicLayout>
  );
};

export default Registration;