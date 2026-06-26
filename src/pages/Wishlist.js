import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import "../style/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const [foods, setFoods] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
    const BASE_URL = "https://softworktech.com/asad_ecom";


  // ✅ Fetch wishlist
  const fetchWishlist = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const res = await fetch("https://softworktech.com/asad_ecom/api/wishlist/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const foodIds = data.map((item) => item.food);
      setWishlist(foodIds);

      // Fetch each food detail
      const foodPromises = foodIds.map((id) =>
        fetch(`https://softworktech.com/asad_ecom/api/foods/${id}/`).then((res) => res.json())
      );
      const foodsData = await Promise.all(foodPromises);
      setFoods(foodsData);
    } catch (err) {
      console.error("Failed to fetch wishlist or food details", err);
      toast.error("Failed to load wishlist.");
    }
  };

  useEffect(() => {
    fetchWishlist();
    window.addEventListener("wishlist-update", fetchWishlist);
    return () => window.removeEventListener("wishlist-update", fetchWishlist);
  }, []);

  // ✅ Only remove from wishlist
  const removeFromWishlist = async (foodId) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.info("Please log in.");
      navigate("/login-user");
      return;
    }

    try {
      const res = await fetch("https://softworktech.com/asad_ecom/api/wishlist/remove/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ food_id: foodId }),
      });
      const data = await res.json();
      toast.success(data.message);

      // Update local UI
      setWishlist((prev) => prev.filter((id) => id !== foodId));
      setFoods((prev) => prev.filter((food) => food.id !== foodId));

      window.dispatchEvent(new Event("wishlist-update"));
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
      toast.error("Failed to remove item.");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Wishlist</h2>
        {foods.length === 0 ? (
          <p className="text-center">Your wishlist is empty.</p>
        ) : (
          <div className="row">
            {foods.map((food) => (
              <div className="col-md-4 mb-4" key={food.id}>
                <div className="card h-100 position-relative">
                 <img
    src={
      food?.image
        ? `${BASE_URL}${food.image}`
        : food?.image
        ? `${BASE_URL}${food.image}`
        : "/images/default-food.png"
    }
    alt={food?.name || food?.name || "food image"}
    className="img-fluid rounded shadow-sm"
    style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
  />
                  {/* Remove heart */}
                  <i
                    className="fas fa-heart text-danger position-absolute top-0 end-0 m-2"
                    style={{
                      padding: "8px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: "22px",
                      zIndex: 10,
                      textShadow: "0 0 3px black",
                    }}
                    onClick={() => removeFromWishlist(food.id)}
                  ></i>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{food.item_name || food.name}</h5>
                    <p className="card-text">{food.description}</p>
                    <Link
                      to={`/food/${food.id}`}
                      className="btn btn-primary mt-auto"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Wishlist;