import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/RadialMenu.css";
import Chatmodal from '../components/Chatmodal'; // ✅ import

import {
  FaHouse,
  FaTruck,
  FaUtensils,
  FaUser,
  FaGear,
  FaComment,
  FaFacebook,
} from "react-icons/fa6";

const RadialMenu = () => {
  const [open, setOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const toggleMenu = () => setOpen(!open);

  const items = [
    { icon: <FaHouse className="menu-icon" />, path: "/",label:'home' },

    // ❌ FIX: extra space remove
    { icon: <FaTruck className="menu-icon" />, path: "/track" , label:'track'},

    { icon: <FaUtensils className="menu-icon" />, path: "/menu",label:"menu" },
    { icon: <FaUser className="menu-icon" />, path: "/profile",label:'profile' },
    { icon: <FaGear className="menu-icon" />, path: "/change-password",label:'setting' },

    { icon: <FaFacebook className="menu-icon" />, path: "https://www.facebook.com/profile.php?id=61571667248926",
          label: "Facebook",

     },

    // ✅ CHAT BUTTON (action)
    {
      icon: <FaComment className="menu-icon" />,
      action: () => setShowChat(true),
      label:'chat'
    },
  ];

  const spacing = 60;

  return (
    <>
      <div className="radial-menu-container">

        {/* Main Button */}
        <button className="radial-menu-btn" onClick={toggleMenu}>
          {open ? "✕" : "☰"}
        </button>

        {items.map((item, index) => {

          const middle = Math.floor(items.length / 1);

          const y =
            index < middle
              ? open
                ? -((middle - index) * spacing)
                : 0
              : open
              ? (index - middle + 1) * spacing
              : 0;

          return (
            <React.Fragment key={index}>

              {/* Line */}
              <div
                className="radial-menu-line"
                style={{
                  top: y < 0 ? "auto" : "50px",
                  bottom: y < 0 ? "50px" : "auto",
                  height: open ? Math.abs(y) + "px" : "0px",
                }}
              ></div>

              {/* ✅ CONDITION: path OR action */}
              {item.path ? (
                <Link
                  to={item.path}
                  className="radial-menu-item"
                  style={{
                    transform: `translateY(${y}px)`,
                    opacity: open ? 1 : 0,
                  }}
                >
                  {item.icon}
                    <span className="menu-text">{item.label}</span>

                </Link>
              ) : (
                <button
                  onClick={item.action}
                  className="radial-menu-item"
                  style={{
                    transform: `translateY(${y}px)`,
                    opacity: open ? 1 : 0,
                    border: "none",
                    
                  }}
                >
                  {item.icon}
                    <span className="menu-text">{item.label}</span>

                </button>
              )}

            </React.Fragment>
          );
        })}
      </div>

      {/* ✅ CHAT POPUP */}
      {showChat && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "350px",
            zIndex: 9999,
            background: "#d8d9e1",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #ddd"
            }}
          >
            <strong>Chat</strong>
            <button
              onClick={() => setShowChat(false)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "18px"
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ maxHeight: "400px", overflow: "auto" }}>
            <Chatmodal />
          </div>
        </div>
      )}
    </>
  );
};

export default RadialMenu;