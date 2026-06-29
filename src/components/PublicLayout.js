import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../style/PublicLayout.css";
import { AuthContext } from "../pages/AuthContext";
import { WishlistContext } from "../pages/WishlistContex"; // ✅ correct import
import RadialMenu from "./RadialMenu";
import { useLocation } from "react-router-dom";
import FloatingChat from "./FloatingChat";
import {
  FaHouse,
  FaRightToBracket as FaSignInAlt,
  FaTruck,
  FaUserPlus,
  FaUserShield,
  FaUtensils,
  FaRightFromBracket,
  FaHeart,
  FaUser,
  FaPercent 
} from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
const { isLogged, user, cartCount } = useContext(AuthContext);
  const { wishlistCount } = useContext(WishlistContext); // ✅ correct useContext


  const location = useLocation();
  
  const handleLogout = () => {
  // Clear localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("userToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("riderToken");
  localStorage.removeItem("riderRefresh");
  localStorage.removeItem("rider_id");


  // Trigger logout event so AuthContext resets
  window.dispatchEvent(new Event("logout"));

  navigate("/login-user");
};


  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <FaUtensils className="me-2" />
            Food Ordering System
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

              <li className="nav-item">
                <NavLink className="nav-link" to="/"><FaHouse className="me-1" /> Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/offer"><FaPercent  className="me-1" /> offer</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/menu"><FaUtensils className="me-1" /> Menu</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/track"><FaTruck className="me-1" /> Track</NavLink>
              </li>

              {!isLogged && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/registration"><FaUserPlus className="me-1" /> Register</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login-user"><FaSignInAlt className="me-1" /> Login</NavLink>
                  </li>
                  
                </>
              )}

              {isLogged && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/whishlist"><FaHeart className="me-1" /> Whishlist
                    
                    {wishlistCount > 0 && (
                        <span className="badge bg-danger ms-1 rounded-pill">
                          {wishlistCount}
                        </span>
                      )}</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/cartD">
                      <FaShoppingCart className="me-1" /> Cart
                      {cartCount > 0 && (
                        <span className="badge bg-danger ms-1 rounded-pill">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/my-order"><FaUser className="me-1" /> My Order</NavLink>
                  </li>

                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <FaUserShield className="me-1" /> {user?.first_name}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li><a className={`dropdown-item ${location.pathname === '/profile' ? 'active' : ''}`} href="/profile">Profile</a></li>
                      <li><a className={`dropdown-item ${location.pathname === '/change-password' ? 'active' : ''}`} href="/change-password">Settings</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button onClick={handleLogout} className={`dropdown-item ${location.pathname === '/logout' ? 'active' : ''}`}>
                          <FaRightFromBracket className="me-1" /> Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid p-0" style={{ marginTop: "55px" }}>{children}</div>
      <RadialMenu />

      <footer className="  text-center py-3">
        <p>&copy; {new Date().getFullYear()} Food Ordering System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
