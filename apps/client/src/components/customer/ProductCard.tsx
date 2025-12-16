import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../../contexts/AuthContext";
import {
  likeProduct,
  unlikeProduct,
  getLikedProducts,
  getCustomerByUserId,
} from "../../services/api";

interface ProductCardProps {
  product: Product;
  onAuthRequired?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAuthRequired,
}) => {
  const { id, name, price, offer_price, imageUrl, colors } = product;
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const [customerId, setCustomerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (user) {
        try {
          const customer = await getCustomerByUserId(user.id);
          setCustomerId(customer.id);
        } catch (error) {
          console.error("Error fetching customer data:", error);
        }
      }
    };

    fetchCustomer();
  }, [user]);

  useEffect(() => {
    const checkIfLiked = async () => {
      if (customerId) {
        try {
          const likedProducts = await getLikedProducts(customerId);
          const isProductLiked = likedProducts.some(
            (likedProduct: any) => likedProduct.productId === id
          );
          setIsLiked(isProductLiked);
        } catch (error) {
          console.error("Error checking if product is liked:", error);
        }
      }
    };

    checkIfLiked();
  }, [customerId, id]);

  const discountPercent =
    offer_price && price
      ? Math.round(((price - offer_price) / price) * 100)
      : 0;

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    if (customerId) {
      try {
        if (isLiked) {
          await unlikeProduct(customerId, id);
        } else {
          await likeProduct(customerId, id);
        }
        setIsLiked(!isLiked);
      } catch (error) {
        console.error("Error liking/unliking product:", error);
      }
    }
  };

  return (
    <Link to={`/product/${id}`} className="block overflow-hidden w-full">
      <div className="relative w-full aspect-square">
        {}
        <img
          src={imageUrl || "https://placehold.co/450x450?text=Nordwear"}
          alt={name}
          className="  h-full w-full object-cover opacity-100"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-[#171717] font-[EB-Garamond] text-[#F1F0EE] text-xs px-2 py-1 rounded-sm">
            SPAR {discountPercent}%
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

      <div className="relative pt-3 text-center">
        <h3 className="text-[1rem] text-[#1c1c1c] ">{name}</h3>

        <div className="mt-1.5 flex items-center justify-center">
          <p className="tracking-wide text-[1rem] text-[#1c1c1ca6]">
            {offer_price ? (
              <span className="flex items-center space-x-2">
                <span>{offer_price} kr.</span>
                <span className="line-through text-[#1c1c1ca6]">
                  {price} kr.
                </span>
              </span>
            ) : (
              `${price} kr.`
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
