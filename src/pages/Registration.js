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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://softworktech.com/asad_ecom/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Registration successful!');

        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          mobile: '',
          password: '',
        });

        setTimeout(() => navigate('/login-user'), 1500);
      } else {
        toast.error(data.message || 'Registration failed!');
      }
    } catch (err) {
      toast.error('Server error. Try again.');
    }
  };

  return (
    <PublicLayout>

      <div className="reg-wrapper">

        {/* LEFT FORM */}
        <div className="left">

          <div className="glass-card">

            <h2>User Registration</h2>
            <p>Create your account</p>

            <form onSubmit={handleSubmit}>

              <div className="grid">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />

                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button type="submit">Register</button>

              <p className="login-link">
                Already have account?
                <span onClick={() => navigate('/login-user')}> Login</span>
              </p>

            </form>

          </div>

        </div>

        {/* RIGHT IMAGE */}
        <div className="right"></div>

      </div>

      <ToastContainer />

      {/* STYLE */}
      <style>{`
        .reg-wrapper {
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
          background: url("/images/login.png") center/cover no-repeat;
        }

        /* GLASS CARD */
        .glass-card {
          width: 420px;
          padding: 30px;
          border-radius: 18px;

          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(22px);

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
          margin-bottom: 15px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 10px;

          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.2);

          background: rgba(255,255,255,0.06);
          color: white;
          outline: none;
        }

        input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        input:focus {
          border-color: #60a5fa;
        }

        button {
          width: 100%;
          padding: 12px;
          border-radius: 12px;

          border: none;
          cursor: pointer;

          background: linear-gradient(135deg, #3b82f6, #22c55e);
          color: white;

          font-weight: 600;
          transition: 0.3s;
        }

        button:hover {
          transform: translateY(-2px);
        }

        .login-link {
          text-align: center;
          margin-top: 10px;
          font-size: 13px;
          opacity: 0.8;
        }

        .login-link span {
          color: #60a5fa;
          cursor: pointer;
          margin-left: 5px;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .right {
            display: none;
          }

          .glass-card {
            width: 95%;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

    </PublicLayout>
  );
};

export default Registration;