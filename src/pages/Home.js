// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import "../style/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../components/Loading";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
    const BASE_URL = "https://softworktech.com/asad_ecom";
    const [loading, setLoading] = useState(true);




  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const res = await fetch("https://softworktech.com/asad_ecom/api/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // quantity total
      const total = data.reduce((sum, item) => sum + item.quantity, 0);

      setCartCount(total);

    } catch (err) {
      console.error("Cart error", err);
    }
  };

  useEffect(() => {

    fetchCartCount();

    const updateCart = () => {
      fetchCartCount();
    };

    window.addEventListener("cart-update", updateCart);

    return () => {
      window.removeEventListener("cart-update", updateCart);
    };

  }, []);


  //dfghjkl;
  
// Fetch average ratings for foods
const [ratings, setRatings] = useState({});
const [hoverCount, setHoverCount] = useState(null);

useEffect(() => {
  const fetchRatings = async () => {
    const allRatings = {};

    for (const food of foods) {
      try {
        const res = await fetch(
          `https://softworktech.com/asad_ecom/api/food_rating/${food.id}/`
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
  // Fetch random foods
 useEffect(() => {
  const fetchFoods = async () => {
    try {
      setLoading(true); // ✅ start loading

      const res = await fetch(
        "https://softworktech.com/asad_ecom/api/random_food/"
      );
      

      const data = await res.json();
     
      setFoods(data);

    } catch (err) {
      console.error("Failed to fetch food items", err);

    } finally {
      setLoading(false); // ✅ ALWAYS stop loading
    }
  };

  fetchFoods();
}, []);
  // ✅ Fetch wishlist
  const fetchWishlist = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    fetch("https://softworktech.com/asad_ecom/api/wishlist/", {
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
      ? "https://softworktech.com/asad_ecom/api/wishlist/remove/"
      : "https://softworktech.com/asad_ecom/api/wishlist/add/";
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

  return (
    <PublicLayout>
      
      <ToastContainer position="top-center" autoClose={1000} />

      {/* Hero Section */}
      <section
        className="hero-section py-5 text-center"
        style={{ backgroundImage: 'url("/images/foodH.png")' }}
      >
        
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "40px 20px",
            borderRadius: "10px",
          }}
        >
          <h1 className="display-4">Quick & Hot Food, Delivered to you</h1>
          <p>Craving something tasty? Let's get it to your door!</p>
          <form method="GET" action="/food_search" className="d-flex">
            <input
              type="text"
              name="q"
              placeholder="I would like to eat"
              className="form-control mb-1 me-1"
            />
            <button className="btn btn-warning px-4">Search</button>
          </form>
        </div>
      </section>

      {/* Food List */}
   
      <section className="py-5">
        <div className="container display-flex">
          <h2 className="text-center mb-4">
            Most Loved Dishes This Month{" "}
            <span className="badge bg-danger">Top Picks</span>
          </h2>
          {loading && <Loading />}

          <div className="row mt-4">
            {foods.length === 0 && <p className="text-muted">No food items found.</p>}

            {foods.map((food) => (
              <div key={food.id} className="col-md-3 mb-4 cardHovereffect">
                <div className="card shadow-sm h-100">
                  <div className="position-relative">
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
                  height: "130px",
                  objectFit: "cover",
                }}
              />
                     {/* Offer badge */}
                      {food.offer_active && food.offer_percent > 0 && (
                        <span
                          className="badge bg-danger position-absolute"
                          style={{ top: "10px", left: "10px" }}
                        >
                          🔥 {food.offer_percent}% OFF
                        </span>
                      )}
                    <i
                      className={`fas fa-heart heart-icon position-absolute top-0 end-0 m-2 ${
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
  <h5 className="mb-3">
  <Link
    to={`/food/${food.id}`}
    className="d-block text-center text-white text-decoration-none fw-bold py-2 rounded"
    style={{
      backgroundColor: "#dc3545",
      fontSize: "18px",
    }}
  >
    {food.name}
  </Link>
</h5>
                    <p className="card-text text-muted "
                     style={{
    height: "55px",
    overflowY: "auto",
    fontSize: "14px",
  }}
                    >
                      
                      
                      {food.description}</p>




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
                  <span className="badge bg-danger">{count}</span>

            </div>
          );
        })}

        <small className="text-muted">Hovered: {ratings[food.id].average_rating} stars</small>
      </div>
    )}
  </div>
)}


                    <div className="d-flex justify-content-between align-items-center">
                       {/* Price display */}
                        {food.offer_active ? (
                          <div>
                            <span className="text-muted text-decoration-line-through me-2">
                              ${Number(food.price).toFixed(2)}
                            </span>
                            <span className="fw-bold text-danger">
                              ${Number(food.discounted_price).toFixed(2)}
                              <small className="d-block text-muted">
      Ends: {food.offer_end ? new Date(food.offer_end).toLocaleDateString() : "N/A"}
    </small>
                            </span>
                           
                          </div>
                        ) : (
                          <span className="fw-bold text-primary">
                            ${Number(food.price).toFixed(2)}
                          </span>
                        )}
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
      </section>
      

      {/* How It Works Section */}
      <section className="text-center">
        <div className="py-5">
          <div className="row g-4 text-white hero-section-secind">
            <h2 className="mb-3 fw-bold text-white">How It Works</h2>
            <p className="mb-5 text-white">
              Order your favorite food in just 3 simple steps
            </p>

            <div className="col-md-4">
              <div className="step-card h-100">
                <div className="step-icon bg-primary">🍽️</div>
                <h5 className="fw-bold mt-3">Pick a dish</h5>
                <p>Browse hundreds of delicious meals from our menu.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card h-100">
                <div className="step-icon bg-success">🛒</div>
                <h5 className="fw-bold mt-3">Place your order</h5>
                <p>Add items to cart and confirm in seconds.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card h-100">
                <div className="step-icon bg-danger">🚚</div>
                <h5 className="fw-bold mt-3">Fast delivery</h5>
                <p>Your food arrives hot & fresh at your doorstep.</p>
              </div>
            </div>
          </div>

          <div className="sectionpo">
            <Link
              to="/menu"
              className="btn btn-warning btn-lg fw-bold shadow sectionpobtn"
            >
              Browse Full Menu
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
