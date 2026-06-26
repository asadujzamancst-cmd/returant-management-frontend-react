import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error('Password is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://softworktech.com/asad_ecom/api/admin/reset-password/${uid}/${token}/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Password updated');
        setPassword('');

        setTimeout(() => {
          navigate('/admin-login');
        }, 1500);
      } else {
        toast.error(data.error || 'Failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
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
          <h3 className="text-center text-primary mb-4">
            Admin Reset Password
          </h3>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        </div>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </PublicLayout>
  );
}

export default AdminResetPassword;