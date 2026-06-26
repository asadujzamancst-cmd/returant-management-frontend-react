import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import "../style/Home.css";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const FoodMenu = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "https://softworktech.com/asad_ecom";


  // Fetch foods and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Foods
        const foodRes = await fetch("https://softworktech.com/asad_ecom/api/food-list/");
        if (!foodRes.ok) throw new Error("Failed to fetch food items");
        const foodData = await foodRes.json();

        // Ensure numbers
        const foodsWithNumbers = foodData.map(f => ({
          ...f,
          price: Number(f.price),
          discounted_price: Number(f.discounted_price)
        }));

        setFoods(foodsWithNumbers);
        setFilteredFoods(foodsWithNumbers);

        if (foodsWithNumbers.length > 0) {
          const prices = foodsWithNumbers.map(f => f.discounted_price || f.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange([min, max]);
          setMaxPrice(max);
        }

        // Categories
        const catRes = await fetch("https://softworktech.com/asad_ecom/api/list-category/");
        if (!catRes.ok) throw new Error("Failed to fetch categories");
        const catData = await catRes.json();
        setCategories(catData);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logic
  useEffect(() => {
    let updatedFoods = [...foods];
    const query = searchQuery?.toLowerCase().trim();

    // Search filter (name OR category)
    if (query) {
      updatedFoods = updatedFoods.filter(food => {
        const nameMatch = food.name?.toLowerCase().includes(query);
        const categoryName = food.category_name?.toLowerCase() || "";
        return nameMatch || categoryName.includes(query);
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      updatedFoods = updatedFoods.filter(
        food => food.category_name?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price filter
    updatedFoods = updatedFoods.filter(food => {
      const price = Number(food.discounted_price || food.price) || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    setFilteredFoods(updatedFoods);
    setCurrentPage(1);
  }, [foods, searchQuery, selectedCategory, priceRange]);

  // Pagination
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedFoods = filteredFoods.slice(startIdx, startIdx + itemsPerPage);

  return (
    <PublicLayout>
      <div className="container py-4">
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-4">
            <h5>Search</h5>
            <input
              type="text"
              className="form-control"
              placeholder="Search food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="col-md-4">
            <h5>Category</h5>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={loading}
            >
              <option value="all">All</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.category_name}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <h5>Price: ${priceRange[0]} - ${priceRange[1]}</h5>
            <Slider
              range
              min={0}
              max={maxPrice}
              value={priceRange}
              onChange={(range) => setPriceRange(range)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        )}

      {/* Food Cards */}
{!loading && (
  <div className="row">
    {paginatedFoods.length === 0 ? (
      <p className="text-center">No food items found.</p>
    ) : (
      paginatedFoods.map((food) => (
        <div key={food.id} className="col-lg-4 col-md-6 mb-4">
          <div className="card shadow-sm h-100 border-0">

            <div className="position-relative overflow-hidden">
              <img
                src={
                  food.image
                    ? `${BASE_URL}${food.image}`
                    : "/images/default-food.png"
                }
                className="card-img-top"
                alt={food.name}
                style={{
                  width: "100%",
                  height: "230px",
                  objectFit: "cover",
                }}
              />

              {food.offer_active && food.offer_percent > 0 && (
                <span
                  className="badge bg-danger position-absolute"
                  style={{
                    top: "10px",
                    left: "10px",
                    fontSize: "14px",
                    padding: "8px 10px",
                  }}
                >
                  🔥 {food.offer_percent}% OFF
                </span>
              )}
            </div>

            <div className="card-body d-flex flex-column">

              <h5 className="card-title fw-bold">
                <Link
                  to={`/food/${food.id}`}
                  className="text-decoration-none text-dark"
                >
                  {food.name}
                </Link>
              </h5>

              <p
                className="text-muted"
                style={{
                  minHeight: "70px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {food.description}
              </p>

              <div className="mt-auto">

                {food.offer_active ? (
                  <>
                    <span className="text-muted text-decoration-line-through me-2">
                      ${Number(food.price).toFixed(2)}
                    </span>

                    <span className="fw-bold fs-5 text-danger">
                      ${Number(food.discounted_price).toFixed(2)}
                    </span>

                    <small className="d-block text-muted mt-1">
                      Ends:
                      {" "}
                      {food.offer_end
                        ? new Date(food.offer_end).toLocaleDateString()
                        : "N/A"}
                    </small>
                  </>
                ) : (
                  <span className="fw-bold fs-5 text-primary">
                    ${Number(food.price).toFixed(2)}
                  </span>
                )}

                <div className="mt-3">
                  {food.is_available ? (
                    <Link
                      to={`/food/${food.id}`}
                      className="btn btn-primary w-100"
                    >
                      Order Now
                    </Link>
                  ) : (
                    <button
                      className="btn btn-secondary w-100"
                      disabled
                    >
                      Out of Stock
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      ))
    )}
  </div>
)}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="text-center mt-4">
            <button
              className="btn btn-outline-secondary me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default FoodMenu;