// src/pages/PageSearch.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import "../style/Home.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PageSearch = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";

  const [foods, setFoods] = useState([]);
    const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/food_search/?q=${query}`)
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((err) => console.error("Failed to fetch food items", err));
  }, [query]);

   // ✅ Fetch wishlist
    const fetchWishlist = () => {
      const token = localStorage.getItem("userToken");
      if (!token) return;
  
      fetch("http://127.0.0.1:8000/api/wishlist/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setWishlist(data.map((item) => item.food));
        })
        .catch((err) => console.error("Failed to fetch wishlist", err));
    };
  
    useEffect(() => {
      fetchWishlist();
  
      // ✅ Sync when wishlist changes anywhere
      window.addEventListener("wishlist-update", fetchWishlist);
  
      return () => {
        window.removeEventListener("wishlist-update", fetchWishlist);
      };
    }, []);
  
    // Toggle wishlist
    const toggleWishlist = (foodId) => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        toast.info("Please log in to use wishlist.");
        navigate("/login-user");
        return;
      }
  
      const isInWishlist = wishlist.includes(foodId);
      const url = isInWishlist
        ? "http://127.0.0.1:8000/api/wishlist/remove/"
        : "http://127.0.0.1:8000/api/wishlist/add/";
      const method = isInWishlist ? "DELETE" : "POST";
  
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ food_id: foodId }),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.message);
  
          // ✅ Update local UI instantly
          setWishlist((prev) =>
            isInWishlist
              ? prev.filter((id) => id !== foodId)
              : [...prev, foodId]
          );
  
          // 🔥 VERY IMPORTANT → Update Navbar Badge
          window.dispatchEvent(new Event("wishlist-update"));
        })
        .catch((err) => {
          console.error("Wishlist update failed", err);
          toast.error("Failed to update wishlist.");
        });
    };
  // Fetch average ratings for foods
const [ratings, setRatings] = useState({});
const [hoverCount, setHoverCount] = useState(null);

useEffect(() => {
  const fetchRatings = async () => {
    const allRatings = {};

    for (const food of foods) {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/food_rating/${food.id}/`
        );

        const data = await res.json();

        // পুরো object save করো
        allRatings[food.id] = data;

      } catch (err) {
        console.error("Failed to fetch rating for food", food.id, err);
      }
    }

    setRatings(allRatings);
  };

  if (foods.length > 0) {
    fetchRatings();
  }

}, [foods]);
  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={1000} />
      <div className="container py-4">
        <h3 className="text-primary">
          Result for: <span className="text-dark">{query}</span>
        </h3>

        <div className="row mt-4">
          {foods.length === 0 && (
            <p className="text-muted">No food items found.</p>
          )}

          {foods.map((food) => (
            <div key={food.id} className="col-md-4 mb-4 cardHovereffect">
              <div className="card shadow-sm h-100">
                 <div className="position-relative">
                    <img
                      src={food.image || "/images/default-food.png"}
                      className="card-img-top"
                      alt={food.item_name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <i
                      className={`heart fas fa-heart position-absolute top-0 end-0 m-2 ${
                        wishlist.includes(food.id) ? "text-danger" : "text-white"
                      }`}
                      style={{
                        padding: "5px",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleWishlist(food.id)}
                    ></i>
                  </div>
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                  </h5>
                  <p className="card-text text-muted">{food.description}</p>

                  
                   {ratings[food.id] && (
  <div
    className="d-flex align-items-center rating-summry position-relative mb-2"
    onMouseEnter={() => setHoverCount(food.id)}
    onMouseLeave={() => setHoverCount(null)}
  >
    <div className="me-2">

      {/* Stars */}
      {Array(Math.round(ratings[food.id].average_rating))
        .fill()
        .map((_, i) => (
          <i key={i} className="fas fa-star text-warning"></i>
        ))}

      {Array(5 - Math.round(ratings[food.id].average_rating))
        .fill()
        .map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}

      {/* Rating text */}
      <small className="ms-2">
        {ratings[food.id].average_rating} ⭐
        ({ratings[food.id].total_reviews})
      </small>

    </div>
    {hoverCount === food.id && ratings[food.id] && (
      <div className="ms-2 hover-popup p-2 bg-light border rounded shadow position-absolute" style={{  bottom: "100%", width: "100%", left: "0", zIndex: "10" }}>
        {[...Array(5)].map((_, i) => {
          const star = 5 - i;
          const count = ratings[food.id].breakdown[star] || 0;
          return (
            <div key={i} className="d-flex align-items-center mb-1">
              <span className="me-2">{star} ⭐</span>
              <div className="progress flex-grow-1">
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{ width: `${(count / ratings[food.id].total_reviews) * 100}%` }} 
                  aria-valuenow={(count / ratings[food.id].total_reviews) * 100}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <span className="ms-2">{count} </span>
            </div>
          );
        })}

        <small className="text-muted">Hovered: {ratings[food.id].average_rating} stars</small>
      </div>
    )}
  </div>
)}
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">${food.price}</span>
                    {food.is_available ? (
                    <Link
                      to={`/food/${food.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="fas fa-shopping-basket me-1"></i>
                      Order Now
                    </Link>
                  ) : (
                    <span className="text-danger fw-bold">Out of Stock</span>
                        )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default PageSearch;