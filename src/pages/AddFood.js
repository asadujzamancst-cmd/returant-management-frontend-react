import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFood = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    item_name: "",
    description: "",
    price: "",
    item_quantity: "",
    is_available: true,
    image: null
  });

  // category load
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    fetch("https://softworktech.com/asad_ecom/api/list-category/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch(() => {
        toast.error("Category load failed");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file
      }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("category", formData.category);
    data.append("name", formData.item_name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("quantity", formData.item_quantity);
    data.append("is_available", formData.is_available);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await fetch("https://softworktech.com/asad_ecom/api/add-fooditems/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      const result = await res.json();
      console.log(result);

      if (res.status === 201) {
        toast.success("Food Added Successfully");
        setFormData({
          category: "",
          item_name: "",
          description: "",
          price: "",
          item_quantity: "",
          is_available: true,
          image: null
        });
        setPreview(null);
      } else {
        toast.error(JSON.stringify(result));
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="container mt-4">
        <div className="card shadow p-4">
          <h3> Add Food Item </h3>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <select
              className="form-control mb-3"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value=""> Select Category </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>

            <input
              className="form-control mb-3"
              placeholder="Food Name"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
            />

            <textarea
              className="form-control mb-3"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />

            <input
              className="form-control mb-3"
              placeholder="Quantity"
              name="item_quantity"
              value={formData.item_quantity}
              onChange={handleChange}
            />

            <input
              type="file"
              className="form-control mb-3"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                width="150"
                className="mb-3 rounded"
              />
            )}

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
              />
              <label> Available </label>
            </div>

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Adding..." : "Add Food"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddFood;
