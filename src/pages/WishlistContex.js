import React, { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);

  // ✅ Fetch Wishlist Count
  const fetchWishlistCount = async () => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setWishlistCount(0);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/wishlist/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch wishlist");

      const data = await res.json();
      setWishlistCount(data.length);
    } catch (err) {
      setWishlistCount(0);
    }
  };

  const updateWishlist = async () => {
    const token = localStorage.getItem("userToken");

    if (token) {
      await fetchWishlistCount();
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    updateWishlist();

    const loginListener = () => updateWishlist();
    const logoutListener = () => setWishlistCount(0);
    const wishlistListener = () => fetchWishlistCount();

    window.addEventListener("login", loginListener);
    window.addEventListener("logout", logoutListener);
    window.addEventListener("wishlist-update", wishlistListener);

    return () => {
      window.removeEventListener("login", loginListener);
      window.removeEventListener("logout", logoutListener);
      window.removeEventListener("wishlist-update", wishlistListener);
    };
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlistCount, fetchWishlistCount, updateWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};