// components/ProductCard.tsx
import Link from "next/link";
import { IProduct } from "../types";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/product/${product._id}?category=${product.category}`} passHref>
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col cursor-pointer">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name || "Product"}
          className="rounded-lg mb-4 object-cover w-full h-48"
        />
        <h2 className="text-lg font-semibold">{product.name || "Unnamed Product"}</h2>
        <p className="text-gray-600 mt-2">₹{product.price ?? 0}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
