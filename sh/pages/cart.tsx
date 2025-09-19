import { NextPage } from "next";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";
import { ShoppingCart, Trash2 } from "lucide-react";

const CartPage: NextPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  // Buy Now for a single product
  const handleBuyNow = (item: any) => {
    router.push({
      pathname: "/buy-now",
      query: { product: JSON.stringify(item) },
    });
  };

  // Buy All items
  const handleBuyAll = () => {
    router.push({
      pathname: "/buy-now",
      query: { cart: JSON.stringify(cart) },
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <ShoppingCart size={64} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800">Your Cart is Empty</h1>
        <p className="text-gray-500 mt-2">
          Looks like you haven’t added anything yet.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-lg font-medium shadow hover:bg-pink-600 transition"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-14 px-4 lg:px-14">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-6 p-5 border border-gray-200 rounded-xl bg-white shadow-sm"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-contain rounded-md"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                <p className="text-gray-700">Size: {item.selectedSize}</p>
                <p className="text-gray-700">Quantity: {item.quantity}</p>
                <p className="text-gray-900 font-medium mt-1">₹{item.price}</p>

                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="text-pink-600 font-medium hover:underline"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => removeFromCart(item._id, item.selectedSize)}
                    className="flex items-center gap-1 text-red-600 hover:underline"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:underline font-medium"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Total Items</span>
            <span>{cart.length}</span>
          </div>
          <div className="flex justify-between mb-6 text-gray-900 font-medium">
            <span>Total Price</span>
            <span>
              ₹
              {cart.reduce(
                (sum, item) => sum + item.price * (item.quantity || 1),
                0
              )}
            </span>
          </div>
          <button
            onClick={handleBuyAll}
            className="w-full bg-pink-500 text-white font-medium py-4 rounded-lg shadow hover:bg-pink-600 transition"
          >
            Buy All
          </button>

          {/* Extra navigation buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/"
              className="w-full text-center bg-gray-100 text-gray-700 py-3 rounded-lg font-medium shadow hover:bg-gray-200 transition"
            >
              🏠 Back to Home
            </Link>
            <Link
              href="/explore"
              className="w-full text-center bg-gray-100 text-gray-700 py-3 rounded-lg font-medium shadow hover:bg-gray-200 transition"
            >
              🔎 Explore More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
