import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewFoodOrder = () => {
  const navigate = useNavigate();
  const { order_number } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminuser = localStorage.getItem('adminuser');
    const token = localStorage.getItem('adminToken');

    if (!adminuser || !token) {
      navigate('/admin-login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `https://softworktech.com/asad_ecom/api/admin-order-detail/${order_number}/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          localStorage.removeItem('adminuser');
          localStorage.removeItem('adminToken');
          navigate('/admin-login');
          return;
        }

        const json = await res.json();

        if (json.error) {
          toast.error(json.error);
          setData(null);
        } else {
          setData(json);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [navigate, order_number]);

  if (loading) return <AdminLayout><p className="mt-10">Loading...</p></AdminLayout>;
  if (!data || !data.order) return <AdminLayout><p className="mt-10">Order not found.</p></AdminLayout>;

  const { order, foods, tracking } = data;
  const statuseOption =["order confirm","food being ready","pickup","deliverd","canceld"]
  const currentstutus = order.order_final_status
  const visibalOption = statuseOption.slice(statuseOption.indexOf(currentstutus)+1)
  return (
    <AdminLayout>
      <div className="p-4 shadow-sm rounded">
        <h3>Order #{order.order_number}</h3>

        {/* Customer Info */}
        <div className='row mb-4'>
          <div className='col-md-6'>
            <h4>Customer Info</h4>
            <table className='table table-bordered'>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{order.user_first_name} {order.user_last_name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{order.email}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>{order.mobile}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{order.address}</td>
                </tr>
                
                <tr>
                  <th>order time</th>
                  <td>{new Date(order.order_time).toLocaleString()}</td>
                </tr>
                
                  
                <tr>
                  <th>Status</th>
                  <td>{order.order_final_status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ordered Foods */}
        <div className='row mb-4'>
          <div className='col-md-12'>
            <h4>Ordered Foods</h4>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {foods && foods.length > 0 ? (
                  foods.map((food, i) => (
                    <tr key={i}>
                      <td>{food.item_name}</td>
                      <td>${food.price}</td>
                      <td>
                        {food.image ? (
                          <img src={food.image} alt={food.item_name} width={100} />
                        ) : (
                          'No image'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>No foods found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tracking Info */}
        <div className='row mb-4'>
          <div className='col-md-12'>
            <h4>Tracking Info</h4>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Remark</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tracking && tracking.length > 0 ? (
                  tracking.map((track, i) => (
                    <tr key={i}>
                      <td>{track.status}</td>
                      <td>{track.remark || '—'}</td>
                      <td>{new Date(track.status_date).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>No tracking info</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
                {order.order_final_status !== "delivered" &&(
                
            
            <div className='mt-4 mb-3'>
  <h4>Update Status</h4>
  <form
  onSubmit={(e) => {
    e.preventDefault();
    const status = e.target.status.value;
    const remark = e.target.remark.value;

    console.log('Selected Status:', status);
    console.log('Remark:', remark);

    // Call API to update status
    fetch(`https://softworktech.com/asad_ecom/api/admin-update-order-status/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`, // if needed
      },
      body: JSON.stringify({
        status,
        remark,
        order_number: order.order_number
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.message) {
          toast.success(res.message);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error(res.error || 'Failed to update status');
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Something went wrong');
      });
  }}
>
  <div className='mb-3'>
    <label htmlFor='status' className='form-label'>Status</label>
    <select id='status' name='status' className='form-select' required>
      {visibalOption.map((status, index) => (
        <option key={index} value={status}>{status}</option>
      ))}
    </select>
  </div>

  <div className='mb-3'>
    <label htmlFor='remark' className='form-label'>Remark</label>
    <textarea
      id='remark'
      name='remark'
      className='form-control'
      rows='3'
      placeholder='Enter a remark (optional)'
    ></textarea>
  </div>

  <div className='text-center'>
    <button type='submit' className='btn btn-success'>Update Status</button>
  </div>
</form>

</div>

            )}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AdminLayout>
  );
};

export default ViewFoodOrder;
