import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import React, { useState } from 'react';
import '../style/Admin.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicLayout from '../components/PublicLayout';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Username and password are required!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://softworktech.com/asad_ecom/api/admin_login/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('adminToken', data.access);
        localStorage.setItem('adminId', data.admin_id);
        localStorage.setItem('adminuser', 'true');

        toast.success('Login successful!');

        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1000);
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>

      <div className="admin-wrapper">

        {/* LEFT SIDE (FORM) */}
        <div className="admin-left">

          <div className="admin-card">
            <h2>
              <FaUser /> Admin Login
            </h2>

            <form onSubmit={handleLogin}>

              <div className="field">
                <label>Username</label>
                <div className="input-box">
                  <FaUser />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="field">
                <label>Password</label>
                <div className="input-box">
                  <FaLock />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <button disabled={loading}>
                <FaSignInAlt />
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="forgot">
                <Link to="/admin-forgot-password">Forgot Password?</Link>
              </div>

            </form>
          </div>

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="admin-right"></div>

      </div>

      <ToastContainer position="top-center" autoClose={2000} />

      <style>{`
        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #0b1220, #111827);
        }

        /* LEFT */
        .admin-left {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        /* CARD GLASS */
        .admin-card {
          width: 380px;
          padding: 30px;
          border-radius: 18px;

          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(25px);

          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
          color: white;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
        }

        .field {
          margin-bottom: 14px;
        }

        label {
          font-size: 13px;
          opacity: 0.8;
        }

        .input-box {
          display: flex;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.2);
        }

        input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: white;
        }

        button {
          width: 100%;
          padding: 11px;
          border: none;
          border-radius: 12px;
          margin-top: 10px;

          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          cursor: pointer;
        }

        .forgot {
          text-align: right;
          margin-top: 10px;
        }

        .forgot a {
          color: #93c5fd;
        }

        /* RIGHT IMAGE */
        .admin-right {
          flex: 1;
          background: url("/images/admin.png") center/cover no-repeat;
        }

        /* MOBILE VIEW */
        @media (max-width: 768px) {
          .admin-right {
            display: none;
          }

          .admin-card {
            width: 100%;
            max-width: 360px;
          }
        }
      `}</style>

    </PublicLayout>
  );
};

export default AdminLogin;