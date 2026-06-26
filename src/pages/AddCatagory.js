import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategoryPage = () => {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error('Category name cannot be empty!');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('You are not logged in!');
      return;
    }


    try {
      

      const response = await fetch('http://127.0.0.1:8000/api/add-category/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ category_name: categoryName }),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success(data.message);
        setCategoryName('');
        setTimeout(() => {
          window.location.href = '/admin-dashboard';
        }, 1000);
      } else {
        toast.error(data.message || 'Failed to add category.');
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
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="p-5 shadow-sm rounded bg-white">
              <h3 className="mb-4 text-center">Add New Category</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter Category Name"
                    disabled={loading}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Category'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </AdminLayout>
  );
};

export default AddCategoryPage;
