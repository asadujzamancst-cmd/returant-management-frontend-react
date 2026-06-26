import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { useParams, useNavigate } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Home.css";

const FoodDetail = () => {
  const [food, setFood] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("userToken");

  // Review states
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [editId, setEditId] = useState(null);

  // Fetch food details
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/foods/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch food");
        const data = await res.json();
        setFood(data);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load food details");
      }
    };
    fetchFood();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load reviews");
      }
    };
    fetchReviews();
  }, [id]);

  const fetchreviews = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reviews/${food.id}/`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!token) {
      toast.warning("Please login first");
      navigate("/login-user");
      return;
    }

    const payload = { rating, comment };
    const url = editId
      ? `http://127.0.0.1:8000/api/reviews/review_edit/${editId}/`
      : `http://127.0.0.1:8000/api/reviews/add/${food.id}/`;
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editId ? "Review Updated" : "Review Added");
      setRating(0);
      setComment("");
      setEditId(null);
      fetchreviews();
    } else {
      toast.error("Failed to submit review");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    const res = await fetch(`http://127.0.0.1:8000/api/reviews/review_edit/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast.success("Review deleted successfully!");
      fetchreviews();
    } else toast.error("Failed to delete review");
  };

  const renderStars = (count, clickable = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fa-star fa-solid ${i <= count ? "fas text-warning" : "fas text-muted"}`}
          style={{ cursor: clickable ? "pointer" : "default", fontSize: "20px", marginRight: "5px" }}
          onClick={clickable ? () => setRating(i) : null}
          onMouseEnter={clickable ? () => setHoverRating(i) : null}
          onMouseLeave={clickable ? () => setHoverRating(0) : null}
        ></i>
      );
    }
    return stars;
  };

  // Wishlist
  const fetchWishlist = () => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/wishlist/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setWishlist(data.map((item) => item.food)))
      .catch((err) => console.error("Failed to fetch wishlist", err));
  };

  useEffect(() => {
    fetchWishlist();
    window.addEventListener("wishlist-update", fetchWishlist);
    return () => window.removeEventListener("wishlist-update", fetchWishlist);
  }, []);

  const toggleWishlist = (foodId) => {
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ food_id: foodId }),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success(data.message);
        setWishlist((prev) =>
          isInWishlist ? prev.filter((id) => id !== foodId) : [...prev, foodId]
        );
        window.dispatchEvent(new Event("wishlist-update"));
      })
      .catch(() => toast.error("Failed to update wishlist."));
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please login first!");
      setTimeout(() => navigate("/login-user"), 1500);
      return;
    }
    if (!food?.id) return toast.error("Food data not loaded yet");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/cart/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ food: food.id }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text }; }

      if (res.ok) {
        toast.success(data.message || "Added to cart successfully!");
        window.dispatchEvent(new Event("cart-update"));
        setTimeout(() => navigate("/cartD"), 1500);
      } else {
        toast.error(data.error || data.message || "Failed to add to cart");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Image + Heart */}
          <div className="col-md-5 text-center position-relative mb-4 mb-md-0">
            <Zoom>
              <img
                src={food?.image || "/images/default-food.png"}
                alt={food?.name || food?.item_name}
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "300px", objectFit: "cover" }}
              />
            </Zoom>

            <i
              className={`fas fa-heart heart position-absolute top-0 end-0 m-3 ${
                wishlist.includes(food?.id) ? "text-danger" : "text-white"
              }`}
              style={{
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "24px",
                zIndex: 10,
                textShadow: "0 0 3px black",
              }}
              onClick={() => toggleWishlist(food?.id)}
            ></i>
          </div>

          {/* Details */}
          <div className="col-md-7 text-center text-md-start px-3">
            <h2 className="display-5">{food?.name || food?.item_name}</h2>
            <p className="lead text-muted">{food?.description}</p>
            <p className="badge bg-secondary fs-6">{food?.category_name}</p>

            <h3 className="text-primary mt-3">
              {food?.offer_active || food?.offer_active_manual ? (
                <>
                  <span className="text-muted text-decoration-line-through me-2">
                    ${Number(food?.price).toFixed(2)}
                  </span>
                  <span className="fw-bold text-danger">
                    ${Number(food?.discounted_price).toFixed(2)}
                  </span>
                  
                  <span className="badge bg-danger ms-2">🔥 {food.offer_percent}% OFF</span>
                  <small className="d-block text-muted">
      Ends: {food.offer_end ? new Date(food.offer_end).toLocaleDateString() : "N/A"}
    </small>
                </>
              ) : (
                <>${Number(food?.price).toFixed(2)}</>
              )}
            </h3>

            <div className="mt-4">
              {food?.is_available ? (
                <button
                  className="btn btn-primary btn-lg px-5 shadow-sm"
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </button>
              ) : (
                <button className="btn btn-danger btn-lg disabled">Out of Stock</button>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="row mt-5">
          <div className="col-12">
            <h4 className="mb-4 text-primary">Customer Reviews</h4>

            {/* Scrollable Review List */}
            <div
              className="mb-4"
              style={{ maxHeight: "150px", overflowY: "auto", paddingRight: "10px" }}
            >
              {reviews.length === 0 ? (
                <p className="text-muted">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">
                        {review.user_name} {renderStars(review.rating)}
                      </h5>
                      <p className="card-text text-primary">{review.comment}</p>
                      <p>created: {new Date(review.created_at).toLocaleDateString()}</p>
                      {parseInt(review.user_id) === parseInt(localStorage.getItem("userId")) && (
                        <div>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => {
                              setEditId(review.id);
                              setRating(review.rating);
                              setComment(review.comment);
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Review Form */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{editId ? "Edit Your Review" : "Write a Review"}</h5>
                <div className="mb-3">
                  <label className="form-label">Rating:</label>
                  <div>{renderStars(hoverRating || rating, true)}</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Comment:</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <button className="btn btn-success" onClick={handleReviewSubmit}>
                  {editId ? "Update Review" : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FoodDetail;