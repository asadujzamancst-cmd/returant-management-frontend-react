import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword() {
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
      const response = await fetch(
        `https://softworktech.com/asad_ecom/api/reset-password/${uid}/${token}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Password reset successful');

        setPassword('');

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error(data.error || 'Reset failed');
      }
    } catch (error) {
      console.error(error);
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
        <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
          <h3 className="text-center text-primary mb-4">
            Reset Password
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">New Password</label>

              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        </div>

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </PublicLayout>
  );
}

export default ResetPassword;