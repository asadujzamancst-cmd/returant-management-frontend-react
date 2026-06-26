import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopSales = () => {
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    fetch("https://softworktech.com/asad_ecom/api/top_selling_foods/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or fetch error");
        return res.json();
      })
      .then((data) => {
        setTopProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load top selling foods");
        setLoading(false);
      });
  }, [navigate]);

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger text-center my-3">{error}</div>
    );

  return (
    <div className="card p-3 shadow-sm">
      <h5 className="mb-3">Top 5 Selling Foods</h5>
      <ol className="list-group list-group-numbered">
        {topProducts.map((item) => (
          <li
            key={item.food_id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {item.food_name}
            <span className="badge bg-primary rounded-pill">
              {item.total_quantity}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default TopSales;
