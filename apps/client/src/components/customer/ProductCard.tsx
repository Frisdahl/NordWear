import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

interface ProductCardProps {
  product: Product;
  onAuthRequired?: () => void;
}

// Mock auth hook for demonstration. In a real app, this would come from a context or global state.
const useAuth = () => {
  // To test the "logged in" state, you could temporarily change this to:
  // return { user: { name: 'Test User' } };
  return { user: null };
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAuthRequired }) => {
  const { id, name, price, offer_price, imageUrl, colors } = product;
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  const discountPercent =
    offer_price && price
      ? Math.round(((price - offer_price) / price) * 100)
      : 0;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    setIsLiked(!isLiked);
  };

  return (
    <Link to={`/product/${id}`} className="group block overflow-hidden">
      <div className="relative h-[250px] w-[250px] mx-auto">
        <img
          src={imageUrl || "https://placehold.co/250x250?text=Nordwear"}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-300"
        />
        <img
          src={
            imageUrl ||
            "https://placehold.co/250x250/1c1c1c/white?text=Nordwear"
          }
          alt={name}
          className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-[#171717] text-[#F1F0EE] text-xs font-semibold px-2 py-1 rounded-sm">
            Spar {discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleLikeClick}
          className="absolute top-2 right-2 h-8 w-8 bg-[#171717] rounded-full flex items-center justify-center text-white"
        >
          {isLiked ? (
            <HeartIconSolid className="h-5 w-5" />
          ) : (
            <HeartIconOutline className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="relative  pt-3">
        <h3 className="text-sm text-gray-700 group-hover:underline group-hover:underline-offset-4">
          {name}
        </h3>

        <div className="mt-1.5 flex items-center justify-between text-gray-900">
          <p className="tracking-wide">
            {offer_price ? (
              <span className="flex items-center space-x-2">
                <span className="text-[#2E7D32]">
                  kr. {offer_price.toFixed(2)}
                </span>
                <span className="line-through text-[#1c1c1ca6]">
                  kr. {price.toFixed(2)}
                </span>
              </span>
            ) : (
              `kr. ${price.toFixed(2)}`
            )}
          </p>

          <div className="flex items-center space-x-1">
            {colors &&
              colors.map((color) => (
                <div
                  key={color}
                  className="h-4 w-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
