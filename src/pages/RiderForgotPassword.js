import React, { useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';

function RiderForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      'https://softworktech.com/asad_ecom/api/rider/forgot-password/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
    } else {
      toast.error(data.error);
    }
  };

  return (
    <PublicLayout>
      <div className="container mt-5">
        <h3>Rider Forgot Password</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn btn-primary mt-3">
            Send Reset Link
          </button>
        </form>

        <ToastContainer />
      </div>
    </PublicLayout>
  );
}

export default RiderForgotPassword;