import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      setCartLoading(true);
      const { data } = await api.get('/cart');
      setCart(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, tenureMonths = 3) => {
    try {
      const { data } = await api.post('/cart/add', { productId, tenureMonths });
      setCart(data.data);
      toast.success('Added to cart!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data.data);
      toast.success('Removed from cart');
    } catch (e) {
      toast.error('Failed to remove item');
    }
  };

  const updateCartItem = async (productId, tenureMonths) => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { tenureMonths });
      setCart(data.data);
    } catch (e) {
      toast.error('Failed to update item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({ items: [] });
    } catch (e) {}
  };

  const cartCount = cart?.items?.length || 0;

  const cartTotal = cart?.items?.reduce((sum, item) => {
    const rent = item.product?.monthlyRent || 0;
    const deposit = item.product?.securityDeposit || 0;
    return sum + rent * item.tenureMonths + deposit;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, cartTotal, addToCart, removeFromCart, updateCartItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
