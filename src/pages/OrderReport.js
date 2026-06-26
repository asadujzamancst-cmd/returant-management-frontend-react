import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderReport = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    from_date: '',
    to_date: '',
    status: 'all',
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all orders initially
  useEffect(() => {
    const adminuser = localStorage.getItem('adminuser');
    const token = localStorage.getItem('adminToken');

    if (!adminuser || !token) {
      navigate('/admin-login');
      return;
    }

    fetch('https://softworktech.com/asad_ecom/api/all-order/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          // Token invalid or expired
          localStorage.removeItem('adminuser');
          localStorage.removeItem('adminToken');
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

  // ✅ Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Filter orders between dates
  const handleSubmit = async (e) => {
    
    e.preventDefault();

    if (!formData.from_date || !formData.to_date) {
      toast.error('Please select both from and to dates.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      

      const response = await fetch('https://softworktech.com/asad_ecom/api/order-between-date/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      
      const data = await response.json();
        console.log("FILTER RESPONSE =", data);


      if (response.ok) {
        setOrders(data);
        toast.success(data.message || 'Orders filtered successfully!');
      } else {
        toast.error(data.message || 'Failed to fetch orders.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 shadow-sm rounded">
        <h2 className="text-primary mb-3">Order Report</h2>

        {/* Filter Form */}
        <form onSubmit={handleSubmit} className="mb-4 d-flex gap-2 flex-wrap">
          <input
            type="date"
            name="from_date"
            value={formData.from_date}
            onChange={handleChange}
            className="form-control"
          />
          <input
            type="date"
            name="to_date"
            value={formData.to_date}
            onChange={handleChange}
            className="form-control"
          />
             <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >

            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preapd">Preapd</option>
            <option value="picup">picup</option>
            <option value="canceld">canceld</option>
            <option value="Delivered">Delivered</option>
            
          </select>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Filtering...' : 'Filter'}
          </button>
        </form>

        {/* Orders Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>SL</th>
                <th>Order Number</th>
                
                <th>Status</th>
                <th>Order Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.order_number}</td>
                    
                    <td>{order.order_final_status}</td>
                    <td>{new Date(order.order_time).toLocaleDateString()}</td>
                    <td>
                     <Link
                    className="btn btn-primary"
                    to={`/admin-view-details/${order.order_number}`}
                  >
                    view
                  </Link>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminLayout>
  );
};

export default OrderReport;
