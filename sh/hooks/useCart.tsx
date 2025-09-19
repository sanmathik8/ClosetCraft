// hooks/useCart.tsx
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { IProduct, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: IProduct, quantity: number, selectedSize: string) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: IProduct, quantity: number, selectedSize: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item._id === product._id && item.selectedSize === selectedSize
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...product, quantity, selectedSize }];
    });
  };

  const removeFromCart = (productId: string, selectedSize: string) => {
    setCart(prev =>
      prev.filter(item => !(item._id === productId && item.selectedSize === selectedSize))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
