import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MonthlyChart from "./MonthlyChart";
import SalesChart from "./SalesChart";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    total_orders: 0,
    new_orders: 0,
    prepare_orders: 0,
    pickup_orders: 0,
    confirmed_orders: 0,
    delivered_orders: 0,
    cancelled_orders: 0,
    total_users: 0,
    total_categories: 0,
    today_sales: 0,
    week_sales: 0,
    monthly_sales: 0,
    yearly_sales: 0,
    total_reviews: 0,
    total_wishlist: 0,
  });
  const cardData=[
    {title:"Total Orders",icon:"fas fa-shopping-cart", value:metrics.total_orders ,color:"primary"},
    {title:"New Orders",icon:"fas fa-cart-plus", value:metrics.new_orders ,color:"info"},
    {title:"Prepare Orders",icon:"fas fa-box-open", value:metrics.prepare_orders ,color:"warning"},
    {title:"Pickup Orders",icon:"fas fa-truck", value:metrics.pickup_orders ,color:"secondary"},
    {title:"Confirmed Orders",icon:"fas fa-check", value:metrics.confirmed_orders ,color:"success"},
    {title:"Delivered Orders",icon:"fas fa-shipping-fast", value:metrics.delivered_orders ,color:"dark"},
    {title:"Canceled Orders",icon:"fas fa-times", value:metrics.cancelled_orders ,color:"danger"},
    {title:"Total Users",icon:"fas fa-users", value:metrics.total_users ,color:"primary"},
    {title:"Total Categories",icon:"fas fa-list", value:metrics.total_categories ,color:"info"}, 
      {title:"Today Sales",icon:"fas fa-dollar-sign", value:metrics.today_sales ,color:"success"},
      {title:"Week Sales",icon:"fas fa-dollar-sign", value:metrics.week_sales ,color:"warning"},
      {title:"Monthly Sales",icon:"fas fa-dollar-sign", value:metrics.monthly_sales ,color:"secondary"},
      {title:"Yearly Sales",icon:"fas fa-dollar-sign", value:metrics.yearly_sales ,color:"dark"},
      {title:"Total Reviews",icon:"fas fa-star", value:metrics.total_reviews ,color:"primary"},
      {title:"Total Wishlist",icon:"fas fa-heart", value:metrics.total_wishlist ,color:"danger"},

  ]

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    fetch("http://127.0.0.1:8000/api/dashbord/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load dashboard");
      });
  }, [navigate]);

  return (
    <AdminLayout>
  <ToastContainer />
  <div className="row g-3"> {/* gap-3 ঠিক আছে */}
    {/* Dynamic cards from cardData */}
    {cardData.map((card, index) => (
      <div className="col-sm-6 col-md-3" key={index}> {/* responsive: small=2-col, medium=4-col */}
        <div className={`p-3 shadow-sm rounded bg-${card.color}`}>
          <h5 className="text-white">
            <i className={`${card.icon} me-2`}></i> {card.title}
          </h5>
          <h3 className="text-white">{card.value}</h3>
        </div>
      </div>
    ))}

    {/* Extra card: Sales Trends */}
    <div className="col-sm-6 col-md-3">
      <div className="card text-white bg-info mb-3 shadow-sm rounded">
        <div className="card-body">
          <h5 className="card-title">
            <i className="fas fa-chart-line me-2"></i> Sales Trends
          </h5>
          <p className="card-text">Visualize sales trends over time.</p>
        </div>
      </div>
    </div>
  </div>

  {/* Sales charts below cards */}
  <SalesChart />
</AdminLayout>



         
        
        
  );
};

export default AdminDashboard;
