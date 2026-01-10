import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "../../types";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../../contexts/AuthContext";
import useCart from "../../hooks/useCart";
import {
  likeProduct,
  unlikeProduct,
  getLikedProducts,
  getCustomerByUserId,
} from "../../services/api";
import { useSpring, animated } from "react-spring";
import Notification from "../Notification";
import { formatPrice } from "../../utils/formatPrice";

interface ProductCardProps {
  product: Product;
  onNotify: (notification: {
    heading: string;
    subtext: string;
    type: "success" | "error";
  }) => void;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNotify,
  className,
  style,
  index = 0,
}) => {
  const { id, name, price, offer_price, images, sizes } = product;
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [customerId, setCustomerId] = useState<number | null>(null);

  const animation = useSpring({
    from: { opacity: 0, transform: "translateX(-20px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: { duration: 300 },
    delay: index * 100,
  });

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
      if (customerId && id) {
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
      onNotify({
        heading: "Login påkrævet",
        subtext: "Du skal være logget ind for at tilføje til ønskelisten.",
        type: "error",
      });
      return;
    }

    if (customerId && id) {
      try {
        if (isLiked) {
          await unlikeProduct(customerId, id);
          onNotify({
            heading: "Fjernet",
            subtext: `${name} er fjernet fra din ønskeliste.`,
            type: "success",
          });
        } else {
          await likeProduct(customerId, id);
          onNotify({
            heading: "Tilføjet",
            subtext: `${name} er tilføjet til din ønskeliste.`,
            type: "success",
          });
        }
        setIsLiked(!isLiked);
      } catch (error) {
        console.error("Error liking/unliking product:", error);
        onNotify({
          heading: "Fejl",
          subtext: "Der skete en fejl. Prøv venligst igen.",
          type: "error",
        });
      }
    }
  };

  const handleAddToCart = (
    e: React.MouseEvent,
    sizeId: number,
    sizeName: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.product_quantity?.find(
      (pq) => pq.sizeId === sizeId
    );
    const colorId =
      variant?.colorId || product.product_quantity?.[0]?.colorId || 1;

    addToCart({
      ...product,
      imageUrl: product.images?.[0]?.url, // Manually add the imageUrl for the cart
      selectedSizeId: sizeId,
      selectedSize: sizeName,
      selectedColorId: colorId,
      quantity: 1,
    });

    onNotify({
      heading: "Lagt i kurv",
      subtext: `${name} (${sizeName}) er lagt i din kurv.`,
      type: "success",
    });
  };

  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
  const sortedSizes = sizes?.sort((a, b) => {
    const indexA = sizeOrder.indexOf(a.name);
    const indexB = sizeOrder.indexOf(b.name);
    if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <animated.div style={{ ...style, ...animation }} className="h-full w-full">
              <div
                className={`flex flex-col h-full overflow-hidden w-full relative ${className}`}
              >        <Link
          to={`/product/${id}`}
          className="block relative w-full aspect-square overflow-hidden flex-shrink-0 group"
        >
          <img
            src={
              images?.[0]?.url || "https://placehold.co/450x450?text=Nordwear"
            }
            alt={name}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0 pointer-events-none"
          />
          {images?.[1] && (
            <img
              src={images[1].url}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 pointer-events-none"
            />
          )}

          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-[#171717] font-['EB_Garamond'] text-[#F1F0EE] text-xs px-2 py-1 rounded-sm z-10">
              SPAR {discountPercent}%
            </div>
          )}

          <button
            onClick={handleLikeClick}
            className="absolute top-2 right-2 h-8 w-8 bg-[#171717] rounded-full flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-30"
          >
            {isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-white" />
            ) : (
              <HeartIconOutline className="h-5 w-5" />
            )}
          </button>

          <div className="absolute rounded-full bottom-2 left-1/2 -translate-x-1/2 py-2 px-3 bg-white hidden md:flex flex-col justify-center items-center translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-20 rounded shadow-sm">
            <div className="flex gap-2 overflow-x-auto w-full justify-center scrollbar-hide pb-1">
              {sortedSizes && sortedSizes.length > 0 ? (
                sortedSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={(e) => handleAddToCart(e, size.id, size.name)}
                    className="h-6 w-6 flex items-center justify-center text-[10px] font-medium text-[#1c1c1c] hover:bg-[#1c1c1c] hover:text-white transition-colors rounded-full"
                  >
                    {size.name}
                  </button>
                ))
              ) : (
                <span className="text-[10px] text-gray-500">Se varianter</span>
              )}
            </div>
          </div>
        </Link>

        <div className="relative pt-3 text-center h-28 flex flex-col justify-center">
                                  <Link to={`/product/${id}`} className="w-fit mx-auto">
                                      <h3 className="text-[14px] md:text-[1rem] text-[#1c1c1c] truncate">{name}</h3>
                                  </Link>
                                  <Link to={`/product/${id}`} className="w-fit mx-auto mt-1.5">
                                    <p className="tracking-wide text-[1rem] text-[#1c1c1ca6]">
                                      {offer_price ? (
                                        <span className="flex items-center space-x-2">
                                          <span>{formatPrice(offer_price)}</span>
                                          <span className="line-through text-[#1c1c1ca6]">
                                            {formatPrice(price)}
                                          </span>
                                        </span>
                                      ) : (
                                        `${formatPrice(price)}`
                                      )}
                                    </p>
                                  </Link>        </div>
      </div>
    </animated.div>
  );
};

export default ProductCard;
