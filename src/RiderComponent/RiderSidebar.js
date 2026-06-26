import React from "react";
import { Link, useLocation } from "react-router-dom";

const RiderSidebar = ({ sidebarOpen }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/rider/dashboard" },
    { name: "Orders", path: "/riderFood" },
    { name: "Profile", path: "#" },
    { name: "earning", path: "#" },
  ];

  return (
    <div
      className="bg-dark text-white vh-100 p-3 position-fixed top-0 start-0"
      style={{
        width: "220px",
        zIndex: 1000,
        transition: "transform 0.3s ease",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <h3 className="text-center mb-4">Rider Panel</h3>
      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li className="nav-item mb-2" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link text-white ${
                location.pathname === item.path ? "fw-bold bg-secondary rounded" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RiderSidebar;