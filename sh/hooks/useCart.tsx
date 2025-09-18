// E:\clothing-store\sh\hooks\useCart.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { IProduct } from '../models/Product';

interface CartItem {
  product: IProduct;
  quantity: number;
}

const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cart);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch cart.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product: IProduct) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add items to your cart.');
      return;
    }

    try {
      await axios.post(
        '/api/cart',
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add to cart.');
      console.error(err);
    }
  };

  const removeFromCart = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      await axios.put(
        '/api/cart',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove from cart.');
      console.error(err);
    }
  };

  return { cartItems, loading, error, addToCart, removeFromCart };
};

export default useCart;