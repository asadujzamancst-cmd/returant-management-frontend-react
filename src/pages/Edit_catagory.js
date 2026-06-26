import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const Edit_catagory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ login check
  useEffect(() => {
    const adminuser = localStorage.getItem("adminuser");
    const token = localStorage.getItem("adminToken");

    if (!adminuser || !token) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // ✅ old data load
  useEffect(() => {
    setLoading(true);
    fetch(`https://softworktech.com/asad_ecom/api/catagory_detail/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setCategoryName(data.name);   // 👈 important
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load category!");
        setLoading(false);
      });
  }, [id]);

  // ✅ update
const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true);

  fetch(`https://softworktech.com/asad_ecom/api/catagory_detail/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category_name: categoryName }),
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        console.log("Server error:", data);
        throw new Error("Update failed");
      }

      toast.success("Updated");
      setTimeout(() => navigate("/manage-catagory"), 1000);
    })
    .catch((err) => {
      console.error(err);
      toast.error("Update failed");
    })
    .finally(() => setLoading(false));
};


  return (
    <AdminLayout>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="p-5 shadow-sm rounded bg-white">
              <h3 className="mb-4 text-center">Edit Category</h3>

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
                  {loading ? "Updating..." : "Update Category"}
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

export default Edit_catagory;
