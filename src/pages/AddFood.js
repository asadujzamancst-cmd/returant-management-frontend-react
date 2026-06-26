import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddFood = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    description: '',
    price: '',
    item_quantity: '',
    is_available: true,
    image: null
  });

  // Load categories
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('http://127.0.0.1:8000/api/list-category/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : type === 'file'
        ? files[0]
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Map frontend fields to backend fields
    data.append('category', formData.category);
    data.append('name', formData.item_name); // ✅ Fixed
    data.append('quantity', formData.item_quantity); // ✅ Fixed
    if (formData.description) data.append('description', formData.description);
    if (formData.price) data.append('price', formData.price);
    data.append('is_available', formData.is_available);

    if (formData.image) data.append('image', formData.image);

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('http://127.0.0.1:8000/api/add-fooditems/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await res.json();
      console.log('Backend response:', result);

      if (res.status === 201) {
        toast.success('Food item added successfully!');
        setFormData({
          category: '',
          item_name: '',
          description: '',
          price: '',
          item_quantity: '',
          is_available: true,
          image: null
        });
      } else {
        const errors = Object.values(result).flat().join(', ');
        toast.error(errors || 'Failed to add food item');
      }
    } catch (err) {
      toast.error('Server error!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <div className="p-4 shadow rounded bg-white">
            <h4 className="mb-4 text-primary">
              <i className="fas fa-hamburger me-2"></i>
              Add Food Item
            </h4>

            <form onSubmit={handleSubmit} encType="multipart/form-data">

              {/* Category */}
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                  ))}
                </select>
              </div>

              {/* Item Name */}
              <div className="mb-3">
                <label className="form-label">Food Name</label>
                <input
                  type="text"
                  name="item_name"
                  className="form-control"
                  value={formData.item_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Price */}
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Quantity */}
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  name="item_quantity"
                  className="form-control"
                  value={formData.item_quantity}
                  onChange={handleChange}
                />
              </div>

              {/* Image */}
              <div className="mb-3">
                <label className="form-label">Food Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Availability */}
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  name="is_available"
                  className="form-check-input"
                  checked={formData.is_available}
                  onChange={handleChange}
                />
                <label className="form-check-label">Available</label>
              </div>

              {/* Submit */}
              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Adding...' : 'Add Food'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddFood;
