import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        'http://127.0.0.1:8000/api/admin/forgot-password/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Reset link sent');
        setEmail('');
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
          backgroundImage: 'url("/images/bg3.png")',
          backgroundSize: 'cover',
        }}
      >
        <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
          <h3 className="text-center text-danger mb-4">
            Admin Forgot Password
          </h3>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <button className="btn btn-danger w-100" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </PublicLayout>
  );
}

export default AdminForgotPassword;