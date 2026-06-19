"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("vs_cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("vs_cart", JSON.stringify(items));
  }, [items]);

  function addItem(item) {
    setItems((prev) => [...prev, { ...item, _key: Date.now() + Math.random() }]);
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i._key !== key));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + Number(i.price) * (i.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
