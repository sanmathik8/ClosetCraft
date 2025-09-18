// context/CartContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "../types";

interface CartContextType {
  cart: CartItem[];
  singleProducts: CartItem[];
  addToCart: (item: CartItem) => void;
  addSingleProduct: (item: CartItem) => void;
  removeFromCart: (id: string, selectedSize?: string) => void;
  increaseQuantity: (id: string, selectedSize?: string) => void;
  decreaseQuantity: (id: string, selectedSize?: string) => void;
  clearCart: () => void;
  clearSingleProducts: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [singleProducts, setSingleProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedSingle = localStorage.getItem("singleProducts");
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedSingle) setSingleProducts(JSON.parse(storedSingle));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("singleProducts", JSON.stringify(singleProducts));
  }, [cart, singleProducts]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const index = prev.findIndex(
        i => i._id === item._id && i.selectedSize === item.selectedSize
      );
      if (index > -1) {
        const updated = [...prev];
        updated[index].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const addSingleProduct = (item: CartItem) => {
    setSingleProducts(prev => {
      const exists = prev.find(
        i => i._id === item._id && i.selectedSize === item.selectedSize
      );
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, selectedSize?: string) => {
    setCart(prev =>
      prev.filter(item =>
        selectedSize ? !(item._id === id && item.selectedSize === selectedSize) : item._id !== id
      )
    );
    setSingleProducts(prev =>
      prev.filter(item =>
        selectedSize ? !(item._id === id && item.selectedSize === selectedSize) : item._id !== id
      )
    );
  };

  const increaseQuantity = (id: string, selectedSize?: string) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id && item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id: string, selectedSize?: string) => {
    setCart(prev =>
      prev
        .map(item =>
          item._id === id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);
  const clearSingleProducts = () => setSingleProducts([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        singleProducts,
        addToCart,
        addSingleProduct,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        clearSingleProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
