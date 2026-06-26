import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function RiderResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `https://softworktech.com/asad_ecom/api/rider/reset-password/${uid}/${token}/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert('Password reset successful');
      navigate('/rider/login');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Reset Rider Password</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="form-control"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-success mt-3">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default RiderResetPassword;