import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import React, { useState } from 'react';
import '../style/Admin.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicLayout from '../components/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';  

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
      const response = await fetch('https://softworktech.com/asad_ecom/api/admin_login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // ✅ Save token
        localStorage.setItem('adminToken', data.access);
          localStorage.setItem('adminId', data.admin_id); // <-- Add this
        console.log("Admin ID:", data.admin_id);

        // ✅ Save login flag (important)
        localStorage.setItem('adminuser', 'true');

        toast.success('Login successful! Redirecting...');

        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 1000);
      } else {
        toast.error(data.message || 'Invalid credentials or not admin');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: 'url("/images/background1.png")',
          backgroundSize: 'cover',
        }}
      >
        <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <h4 className="text-center">
            <FaUser className="me-2" /> Admin Login
          </h4>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">
                <FaUser className="mb-2" /> UserName
              </label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Admin UserName"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaLock className="mb-2" /> Password
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                disabled={loading}
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FaSignInAlt className="me-2" /> {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <div className="text-end mb-3">
  <Link to="/admin-forgot-password">
    Forgot Password?
  </Link>
</div>
        </div>

        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </PublicLayout>
  );
};

export default AdminLogin;
