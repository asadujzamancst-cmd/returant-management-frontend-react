import React, { useState, useEffect } from "react";
import RiderSidebar from "./RiderSidebar";
import RiderHeader from "./RiderHeader";
import "../style/Admin.css";
import { useNavigate } from 'react-router-dom'


const RiderLayout = ({ children, newOrdersCount = 0 }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // open on desktop, closed on mobile
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    const handleLogout = () => {
  // Clear localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("userToken");
  localStorage.removeItem("userId");

  // Trigger logout event so AuthContext resets
  window.dispatchEvent(new Event("logout"));

  navigate("/rider/login");
};


  return (
    <div className="d-flex">

      {/* Sidebar */}
      <RiderSidebar sidebarOpen={sidebarOpen} />

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 999 }}
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-grow-1`}
        style={{
          transition: "all 0.3s",
          marginLeft: sidebarOpen && !isMobile ? "220px" : "0",
        }}
      >
        {/* Header */}
        <RiderHeader
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          new_orders_count={newOrdersCount}
        />

        {/* Page content */}
        <div className="container-fluid mt-4">{children}</div>
      </div>
    </div>
  );
};

export default RiderLayout;