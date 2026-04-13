'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cavok_cart');
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem('cavok_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loaded]);

  const addToCart = (produto) => {
    setCartItems(prev => {
      // Evitar duplicatas
      if (prev.some(item => item.id === produto.id)) return prev;
      return [...prev, produto];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount: cartItems.length, loaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
