// pages/product/[id].tsx
import { GetServerSideProps, NextPage } from "next";
import { IProduct } from "../../types";
import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { ShoppingCart, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "../../context/CartContext";

interface ProductPageProps {
  product?: IProduct;
  relatedProducts?: IProduct[];
  error?: string;
}

const ProductPage: NextPage<ProductPageProps> = ({
  product,
  relatedProducts = [],
  error,
}) => {
  const { addToCart: contextAddToCart, addSingleProduct } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  if (error)
    return <div className="text-center text-red-500 mt-20">{error}</div>;
  if (!product)
    return <div className="text-center text-gray-500 mt-20">Product not found.</div>;

  // Add to Cart
  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select a size.");

    contextAddToCart({ ...product, selectedSize, quantity });
    setShowModal(true);
  };

// Buy Now (direct)
const handleBuyNow = () => {
  if (!selectedSize) return alert("Please select a size.");

  const productData = { ...product, selectedSize, quantity };

  addSingleProduct(productData);

  router.push({
    pathname: "/buy-now",
    query: { product: JSON.stringify(productData) },
  });
};

  return (
    <>
      <Head>
        <title>{product.name} | My Store</title>
      </Head>
      

      <div className="bg-white min-h-screen">
        <div className="container mx-auto py-14 px-4 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

         {/* Product Image */}
<div className="flex flex-col items-center relative">
  {/* Back Button */}
  <button
    onClick={() => router.push(`/category/${product.category}`)}
    className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition"
  >
    ←
  </button>

  <div className="border border-gray-200 rounded-2xl shadow-sm overflow-hidden bg-white p-4">
    <img
      src={product.image}
      alt={product.name}
      className="w-full max-h-[500px] object-contain"
    />
  </div>
</div>


            {/* Product Info */}
            <div className="space-y-7">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
                {product.name}
              </h1>
              <p className="text-3xl font-medium text-gray-800">₹{product.price}</p>
              <div className="flex gap-3">
                <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  Brand: {product.brand || "Unknown"}
                </span>
              </div>

              {/* Size Selector */}
              <div>
                <h2 className="font-medium mb-3 text-gray-800">Select Size</h2>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
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
              <div className="flex items-center gap-3">
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

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white font-medium py-4 rounded-lg shadow hover:bg-gray-800 transition"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 bg-pink-500 text-white font-medium py-4 rounded-lg shadow hover:bg-pink-600 transition"
                >
                  <ShoppingBag size={18} /> Buy Now
                </button>
              </div>

              {/* Description */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Description</h2>
                <div
                  className="text-gray-700 leading-relaxed text-sm space-y-3"
                  dangerouslySetInnerHTML={{ __html: String(product.description || "") }}
                />
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold tracking-tight mb-8 text-gray-900">
                You may also like
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {relatedProducts.map((p) => (
                  <Link
                    key={p._id}
                    href={`/product/${p._id}?category=${p.category}`}
                  >
                    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition cursor-pointer p-5 flex flex-col items-center">
                      <img
                        src={p.image}
                        alt={p.name || "Related product"}
                        className="w-full h-40 object-contain mb-3"
                      />
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-gray-900 font-medium mt-1">₹{p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white">
                <ShoppingCart size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Item Added to Cart</h3>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                <span className="font-medium">{quantity}</span> × {product.name} ({selectedSize}) added.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-1/2 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                >
                  Continue Shopping
                </button>
                <Link
                  href="/cart"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-1/2 py-3 px-6 rounded-lg bg-gray-900 text-white font-medium text-center hover:bg-gray-800 transition"
                >
                  View Cart
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, category } = context.query;

  if (typeof id !== "string" || typeof category !== "string") {
    return { props: { error: "Product ID and category required." } };
  }

  try {
    const productRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${id}?category=${category}`
    );
    if (!productRes.ok) throw new Error("Product not found");
    const productJson = await productRes.json();

    const relatedRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${category}&limit=4`
    );
    const relatedJson = relatedRes.ok ? await relatedRes.json() : { data: [] };

    return {
      props: {
        product: productJson.data,
        relatedProducts: relatedJson.data || [],
      },
    };
  } catch (err: any) {
    return { props: { error: `Failed to load product details: ${err.message}` } };
  }
};

export default ProductPage;
