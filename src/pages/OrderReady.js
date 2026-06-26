import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate } from 'react-router-dom';

const OrderReady = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const adminuser = localStorage.getItem("adminuser");
    const token = localStorage.getItem("adminToken");

    // ✅ not logged in
    if (!adminuser || !token) {
      navigate('/admin-login');
      return;
    }

    fetch('http://127.0.0.1:8000/api/orders-being-ready/', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        // ✅ token expired / invalid
        if (res.status === 401) {
          localStorage.removeItem("adminuser");
          localStorage.removeItem("adminToken");
          navigate('/admin-login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setOrders(data);
      })
      .catch(err => console.log(err));

  }, [navigate]);

  return (
    <AdminLayout>
      <div className="p-4 shadow-sm rounded">
        <h1 className="text-primary">
          <i className="fas fa-list-alt me-1"></i> Detail of order being ready
        </h1>

        <h5 className='text-end text-muted'>
          <i className='fas fa-database me-1'></i> total ready order
          <span className='ms-2 badge bg-success'>
            {orders.length}
          </span>
        </h5>

        <div className="table-responsive mt-3">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>SL</th>
                <th>order number</th>
                <th>order date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length > 0 ? (
                orders.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.order_number}</td>
                    <td>{new Date(item.order_time).toLocaleDateString()}</td>
                    <td>
                      <a className="btn btn-sm btn-primary" href={`/admin-view-details/${item.order_number}`}>
                        View
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No unconfirmed orders found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

      </div>
    </AdminLayout>
  );
}

export default OrderReady;
