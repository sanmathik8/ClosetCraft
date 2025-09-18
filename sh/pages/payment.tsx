// pages/payment.tsx
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const { cart: contextCart } = useCart();
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);

  // Always run this useEffect
  useEffect(() => {
    const buyNow = sessionStorage.getItem("buyNow");
    if (buyNow) setCart(JSON.parse(buyNow));
    else setCart(contextCart);
  }, [contextCart]);

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) return; // only run Razorpay if cart has items

    const loadRazorpay = () => {
      const options = {
        key: "rzp_test_RI5WAa3hI74O7x",
        amount: totalAmount * 100,
        currency: "INR",
        name: "My Clothing Store",
        description: "Purchase from My Clothing Store",
        handler: function (response: any) {
          const now = new Date().toLocaleString();
          const orderData = {
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id || "ORD" + Date.now(),
            amount: totalAmount,
            date: now,
            items: cart,
          };

          sessionStorage.setItem("lastOrder", JSON.stringify(orderData));

          // Save to all orders
          const prevOrders = sessionStorage.getItem("allOrders");
          const allOrders = prevOrders ? JSON.parse(prevOrders) : [];
          allOrders.push(orderData);
          sessionStorage.setItem("allOrders", JSON.stringify(allOrders));

          sessionStorage.removeItem("buyNow"); // clear buy-now after payment
          router.push("/payment-success");
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#f9a8d4" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => loadRazorpay();
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [cart, totalAmount, router]);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">💳 Payment</h1>
        <p className="text-red-500 text-lg">Your cart is empty.</p>
        <button
          onClick={() => router.push("/cart")}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">💳 Processing Payment...</h1>
      <p className="text-gray-700 text-lg">
        Your Razorpay checkout will open shortly. ⏳
      </p>
    </div>
  );
}
