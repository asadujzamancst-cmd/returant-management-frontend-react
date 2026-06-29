import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Edit_food = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [oldImage, setOldImage] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    is_available: true,
    offer_percent: 0,
    offer_start: "",
    offer_end: "",
    image: null,
  });

  // Load categories
  useEffect(() => {
    fetch("https://softworktech.com/asad_ecom/api/list-category/")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // Load food detail
  useEffect(() => {
    fetch(`https://softworktech.com/asad_ecom/api/foods/${id}/`)
      .then((res) => res.json())
      .then((data) => {
          console.log(data);      // এটা দেখো
  console.log(data.image);
        setFormData({
          category: data.category || "",
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          quantity: data.quantity || "",
          is_available: data.is_available,
          offer_percent: data.offer_percent || 0,
          offer_start: data.offer_start ? data.offer_start.slice(0,16) : "",
          offer_end: data.offer_end ? data.offer_end.slice(0,16) : "",
          image: null,
        });
        setOldImage(data.image);
      })
      .catch(() => toast.error("Failed to load food data"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("category", formData.category);
    data.append("name", formData.name);
    data.append("quantity", formData.quantity);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("is_available", formData.is_available);

    data.append("offer_percent", formData.offer_percent);
    data.append("offer_start", formData.offer_start);
    data.append("offer_end", formData.offer_end);

    if (formData.image) data.append("image", formData.image);

    setLoading(true);

    try {
      const res = await fetch(`https://softworktech.com/asad_ecom/api/foods/${id}/`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Food updated successfully!");
        setTimeout(() => navigate("/manage-food"), 1200);
      } else {
        const errors = Object.values(result).flat().join(", ");
        toast.error(errors || "Update failed");
      }
    } catch (err) {
      toast.error("Server error!");
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
              <i className="fas fa-edit me-2"></i>Edit Food Item
            </h4>

            <form onSubmit={handleSubmit} encType="multipart/form-data">

              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Food Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

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

              {/* Offer Section */}

              <div className="mb-3">
                <label className="form-label">Offer Percent (%)</label>
                <input
                  type="number"
                  name="offer_percent"
                  className="form-control"
                  value={formData.offer_percent}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>
              <div className="form-check mb-3">
  <input
    type="checkbox"
    name="offer_active_manual"
    className="form-check-input"
    checked={formData.offer_active_manual}
    onChange={handleChange}
  />
  <label className="form-check-label">Force Offer Active</label>
</div>
              <div className="mb-3">
                <label className="form-label">Offer Start</label>
                <input
                  type="datetime-local"
                  name="offer_start"
                  className="form-control"
                  value={formData.offer_start}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Offer End</label>
                <input
                  type="datetime-local"
                  name="offer_end"
                  className="form-control"
                  value={formData.offer_end}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>

              {oldImage && (
                <div className="mb-3">
                  <p>Current Image:</p>
                  <img
  src={`https://softworktech.com/asad_ecom${oldImage}`}
                    alt="food"
                    width="80"
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Change Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

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

              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Updating..." : "Update Food"}
              </button>

            </form>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Edit_food;