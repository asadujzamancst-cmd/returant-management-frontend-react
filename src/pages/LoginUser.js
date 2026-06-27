import React, { useState, useContext } from 'react';
import PublicLayout from '../components/PublicLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../pages/AuthContext';

const LoginUser = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email_or_mobile: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email_or_mobile.trim() || !formData.password.trim()) {
      toast.error('Email/Mobile and Password are required!');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://softworktech.com/asad_ecom/api/login_user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.access) {
        toast.success(data.message || 'Login successful!');

        localStorage.setItem('userToken', data.access);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('user', JSON.stringify(data.user));

        updateUser();
        setFormData({ email_or_mobile: '', password: '' });

        setTimeout(() => navigate('/'), 800);
      } else {
        toast.error(data.message || 'Login failed. Check credentials.');
      }
    } catch (err) {
      toast.error('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>

      <div className="login-bg">

        {/* BLUR EFFECTS */}
        <div className="blob one"></div>
        <div className="blob two"></div>

        <div className="login-wrapper">

          {/* RIGHT IMAGE (desktop only) */}
          <div className="login-image"></div>

          {/* LOGIN CARD */}
          <div className="login-card">

            <h2>User Login</h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="email_or_mobile"
                placeholder="Email or Mobile"
                value={formData.email_or_mobile}
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
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="links">
                <Link to="/registration">Register</Link>
                <Link to="/admin-login">Admin</Link>
                <Link to="/rider/login">Rider</Link>
              </div>

              <div className="forgot">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

            </form>

          </div>

        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>

      {/* STYLE */}
      <style>{`
        .login-bg {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          background: linear-gradient(135deg, #0f172a, #111827);
          overflow: hidden;
        }

        .blob {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.35;
        }

        .blob.one {
          background: #3b82f6;
          top: -120px;
          left: -120px;
        }

        .blob.two {
          background: #a855f7;
          bottom: -120px;
          right: -120px;
        }

        .login-wrapper {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        /* RIGHT SIDE IMAGE */
        .login-image {
          width: 400px;
          height: 360px;
          border-radius: 20px;
          background: url("/images/login.png") center/cover no-repeat;
        }

        /* GLASS CARD */
        .login-card {
          width: 430px;
          padding: 32px;
          border-radius: 18px;

          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(25px);

          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);

          color: white;
        }

        .login-card h2 {
          text-align: center;
          margin-bottom: 18px;
        }

        input {
          width: 100%;
          padding: 11px;
          margin-bottom: 12px;

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
          padding: 11px;

          border: none;
          border-radius: 12px;

          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;

          font-weight: 600;
          cursor: pointer;
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
          text-align: right;
          margin-top: 10px;
          font-size: 12px;
        }

        .forgot a {
          color: #c4b5fd;
        }

        /* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .login-wrapper {
            flex-direction: column;
          }

          .login-image {
            display: none; /* ✅ mobile hidden */
          }

          .login-card {
            width: 92%;
          }
        }
      `}</style>

    </PublicLayout>
  );
};

export default LoginUser;