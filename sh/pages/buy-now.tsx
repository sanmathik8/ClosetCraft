// pages/buy-now.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";

interface BuyNowProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity?: number;
  selectedSize?: string;
}

const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

export default function BuyNowPage() {
  const router = useRouter();
  const [product, setProduct] = useState<BuyNowProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (router.query.product) {
      try {
        const parsed = JSON.parse(router.query.product as string);
        setProduct(parsed);
        setQuantity(parsed.quantity || 1);
        setSelectedSize(parsed.selectedSize || "");
      } catch {
        setProduct(null);
      }
    }
  }, [router.query.product]);

  const handleBack = () => {
    if (product?.category) {
      router.push(`/category/${product.category}`);
    } else {
      router.push("/cart");
    }
  };

  const handleProceed = () => {
    if (!product) return;
    if (!selectedSize) return alert("Please select a size.");

    const updatedProduct = { ...product, quantity, selectedSize };
    // Save this single product in sessionStorage for payment
    sessionStorage.setItem("buyNow", JSON.stringify([updatedProduct]));
    router.push("/payment");
  };

  if (!product) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Product Found</h1>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 relative">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8 text-center">🛒 Buy Now</h1>
      <div className="bg-white shadow rounded-xl p-6 flex gap-6 flex-col md:flex-row">
        <img
          src={product.image}
          alt={product.name}
          className="w-40 h-40 object-contain rounded border"
        />
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold">{product.name}</h2>

          {/* Size Selector */}
          <div>
            <h3 className="text-gray-700 font-medium mb-2">Select Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-1 rounded-full border text-sm font-medium transition ${
                    selectedSize === size
                      ? "bg-gray-900 text-white shadow"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">Quantity:</span>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
            >
              <Minus size={16} />
            </button>
            <span className="font-medium text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
            >
              <Plus size={16} />
            </button>
          </div>

          <p className="text-gray-900 font-medium mt-2 text-lg">
            Total: ₹{product.price * quantity}
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleProceed}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg shadow"
        >
          <ShoppingCart size={18} />
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
