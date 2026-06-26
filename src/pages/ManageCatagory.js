import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/list-category/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then(data => {
        setCategories(data);
        setAllCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load categories!');
        setLoading(false);
      });
  }, []);

  // Search categories
  const handleSearch = (text) => {
    const keyword = text.toLowerCase();
    if (!keyword) {
      setCategories(allCategories);
      return;
    }

    const filtered = allCategories.filter(category =>
      category.category_name.toLowerCase().includes(keyword)
    );
    setCategories(filtered);
  };

  // Prepare CSV data
  const csvData = categories.map(category => ({
    Category_Name: category.category_name,
    created_at: new Date(category.created_at).toLocaleString(),
  }));

const handleDelete = (id) => {
  if (window.confirm("are you sure")) {
    fetch(`http://127.0.0.1:8000/api/catagory_detail/${id}/`, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then(() => {
        toast.success("Deleted successfully");

        // 🔥 list update instantly
        setCategories((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => console.error(err));
  }
};


 

  return (
    <AdminLayout>
      <div className="p-4 shadow-sm rounded">
        <h1 className="text-primary">
          <i className="fas fa-list-alt me-1"></i> Manage Category Page
        </h1>
        <h5 className="text-end">
          <i className="fas fa-database me-2"></i>
          Total Categories
          <span className="ms-2 badge bg-success">{categories.length}</span>
        </h5>

        <div className="d-flex justify-content-between my-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search Category Here..."
            onChange={(e) => handleSearch(e.target.value)}
          />

          <CSVLink data={csvData} filename={"category_list.csv"} className="btn btn-success">
            <i className="fas fa-file-csv me-2"></i>
            Export CSV
          </CSVLink>
        </div>

        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <table className="table table-bordered table-hover table-striped mt-4">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Category Name</th>
                <th>Creation Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">No categories found</td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.category_name}</td>
                    <td>{new Date(category.created_at).toLocaleString()}</td>
                    <td>
                      <Link to={`/edit_catagory/${category.id}`} className="btn btn-sm btn-primary me-2">
                        <i className="fas fa-edit"></i> Edit
                      </Link>
                      <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(category.id)}>
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </AdminLayout>
  );
};

export default ManageCategory;
