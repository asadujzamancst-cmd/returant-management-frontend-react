import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    
    const token = localStorage.getItem("userToken");
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch("https://softworktech.com/asad_ecom/api/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCartCount(data.length);
    } catch (err) {
      setCartCount(0);
    }
  };

  const updateUser = async () => {
  const u = JSON.parse(localStorage.getItem("user"));
  const userToken = localStorage.getItem("userToken");
  const riderToken = localStorage.getItem("riderToken");

  if (u && userToken) {
    // USER LOGIN
    setIsLogged(true);
    setUser(u);
    await fetchCartCount();

  } else if (riderToken) {
    // RIDER LOGIN
    setIsLogged(true);
    setUser({ role: "rider" });

  } else {
    setIsLogged(false);
    setUser(null);
    setCartCount(0);
  }
};
  useEffect(() => {
    updateUser();

    // Listen to custom events
    const loginListener = () => updateUser();
    const logoutListener = () => updateUser();
    const cartListener = () => fetchCartCount(); // ✅ Listen for cart updates

    window.addEventListener("login", loginListener);
    window.addEventListener("logout", logoutListener);
    window.addEventListener("cart-update", cartListener);

    return () => {
      window.removeEventListener("login", loginListener);
      window.removeEventListener("logout", logoutListener);
      window.removeEventListener("cart-update", cartListener);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLogged, user, cartCount, updateUser, fetchCartCount }}>
      {children}
    </AuthContext.Provider>
  );
};
