import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
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
      const response = await fetch(
        'https://softworktech.com/asad_ecom/api/forgot-password/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message || 'Reset link sent to email'
        );
        setEmail('');
      } else {
        toast.error(
          data.error || 'Something went wrong'
        );
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
        <div
          className="card p-4 shadow-lg"
          style={{
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <h3 className="text-center mb-4 text-primary">
            Forgot Password
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                Email Address
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading
                ? 'Sending...'
                : 'Send Reset Link'}
            </button>
          </form>
        </div>

        <ToastContainer
          position="top-center"
          autoClose={3000}
        />
      </div>
    </PublicLayout>
  );
}

export default ForgotPassword;