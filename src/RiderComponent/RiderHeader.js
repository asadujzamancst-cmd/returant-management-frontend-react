import React from "react";
import { FaBars, FaBell, FaChevronLeft, FaChevronRight, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
const RiderHeader = ({ toggleSidebar, sidebarOpen, new_orders_count = 0 }) => {
    const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('access_token');
    navigate('/rider/login');
  }
  return (
    <nav className="navbar navbar-light bg-light px-3 shadow-sm d-flex align-items-center">
      <button className="btn btn-outline-secondary me-3 d-md-none" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <span className="navbar-brand mb-0 h1">Rider Dashboard</span>

      <div className="ms-auto d-flex align-items-center">
        <button className="btn btn-outline-primary position-relative me-3">
          <FaBell />
          {new_orders_count > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {new_orders_count}
            </span>
          )}
        </button>
        <button className='btn btn-outline-danger align-items-center' onClick={handleLogOut}>
                  <FaSignOutAlt className="me-1"/>
                  Logout
                </button>
      </div>
    </nav>
  );
};

export default RiderHeader;