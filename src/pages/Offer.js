import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link } from "react-router-dom";

const Offer = () => {
  const [offerFoods, setOfferFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://softworktech.com/asad_ecom";

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(
          "https://softworktech.com/asad_ecom/api/random_food/"
        );

        const data = await res.json();

        // শুধু Active Offer
        const offers = data.filter((food) => food.offer_active === true);

        setOfferFoods(offers);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <PublicLayout>
      <div className="container py-5">

        <div className="text-center mb-5">
          <h2 className="fw-bold text-danger">🔥 Today's Offers</h2>
          <p className="text-muted">
            Grab your favourite foods at discounted prices.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger"></div>
          </div>
        ) : offerFoods.length === 0 ? (
          <div className="text-center py-5">
            <h4>No Active Offer Available</h4>
          </div>
        ) : (
          <div className="row">
            {offerFoods.map((food) => (
              <div key={food.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card shadow border-0 h-100">

                  <div className="position-relative">

                    <img
                      src={
                        food.image
                          ? `${BASE_URL}${food.image}`
                          : "/images/default-food.png"
                      }
                      alt={food.name}
                      className="card-img-top"
                      style={{
                        height: "230px",
                        objectFit: "cover",
                      }}
                    />

                    <span
                      className="badge bg-danger position-absolute"
                      style={{
                        top: "10px",
                        left: "10px",
                        fontSize: "15px",
                        padding: "8px 12px",
                      }}
                    >
                      🔥 {food.offer_percent}% OFF
                    </span>

                  </div>

                  <div className="card-body d-flex flex-column">

                    <h5 className="fw-bold">{food.name}</h5>

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

                      <div className="mb-2">
                        <span className="text-decoration-line-through text-secondary me-2 fs-6">
                          ${Number(food.price).toFixed(2)}
                        </span>

                        <span className="text-danger fw-bold fs-4">
                          ${Number(food.discounted_price).toFixed(2)}
                        </span>
                      </div>

                      <small className="text-muted d-block mb-3">
                        Offer Ends :{" "}
                        {food.offer_end
                          ? new Date(food.offer_end).toLocaleString()
                          : "N/A"}
                      </small>

                      {food.is_available ? (
                        <Link
                          to={`/food/${food.id}`}
                          className="btn btn-danger w-100"
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
            ))}
          </div>
        )}

      </div>
    </PublicLayout>
  );
};

export default Offer;