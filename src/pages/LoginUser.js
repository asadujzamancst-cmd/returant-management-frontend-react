import React, { useState, useContext } from 'react';
import PublicLayout from '../components/PublicLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../pages/AuthContext'; // ✅ make sure path is correct

const LoginUser = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext); // ✅ get context updater
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
      const res = await fetch('http://127.0.0.1:8000/api/login_user/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.access) {
        toast.success(data.message || 'Login successful!');

        // ✅ Save token and user info
        localStorage.setItem('userToken', data.access);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('user', JSON.stringify(data.user));

        // ✅ Update context immediately
        updateUser();

        // Reset form
        setFormData({ email_or_mobile: '', password: '' });

        // ✅ Redirect after login
        setTimeout(() => navigate('/'), 1000);
      } else {
        toast.error(data.message || 'Login failed. Check credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
       <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: 'url("/images/bg3.png")',
          backgroundSize: 'cover',
        }}
      >
      <div className="container card p-4 shadow-lg  py-5 " style={{ maxWidth: '400px', width: '100%' }}>
        
        <h2 className="mb-4 text-center text-primary">User Login</h2>

        <form
          onSubmit={handleSubmit}
          className="mx-auto"
          style={{ maxWidth: '500px' }}
        >
          <div className="mb-3">
            <label className="form-label">Email or Mobile</label>
            <input
              type="text"
              name="email_or_mobile"
              className="form-control"
              value={formData.email_or_mobile}
              onChange={handleChange}
              placeholder="Enter email or mobile"
              required
              disabled={loading}
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
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button type="submit" className="btn btn-primary me-2" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <Link className="btn btn-outline-danger me-2" to="/registration">
              Register
            </Link>
            <Link className="btn btn-outline-primary me-2" to='/admin-login'>admin</Link>
                        <Link className="btn btn-outline-primary" to='/rider/login'>rider</Link>

                  
          </div>
        </form>
        <div className="text-end mb-3">
  <Link to="/forgot-password">
    Forgot Password?
  </Link>
</div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
      </div>
    </PublicLayout>
  );
};

export default LoginUser;
