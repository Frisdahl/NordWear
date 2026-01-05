import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "../../types";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../../contexts/AuthContext";
import useCart from "../../hooks/useCart"; // Import useCart
import {
  likeProduct,
  unlikeProduct,
  getLikedProducts,
  getCustomerByUserId,
} from "../../services/api";
import { useSpring, animated } from "react-spring";
import Notification from "../Notification";

interface ProductCardProps {
  product: Product;
  onAuthRequired?: () => void;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAuthRequired,
  className,
  style,
  index = 0,
}) => {
  const { id, name, price, offer_price, imageUrl, sizes } = product; // Destructure sizes
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart(); // Use useCart
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    heading: string;
    subtext: string;
  }>({
    show: false,
    type: "success",
    heading: "",
    subtext: "",
  });

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
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    if (customerId && id) {
      try {
        if (isLiked) {
          await unlikeProduct(customerId, id);
          setNotification({
            show: true,
            type: "success",
            heading: "Fjernet",
            subtext: `${name} er fjernet fra din ønskeliste`,
          });
        } else {
          await likeProduct(customerId, id);
          setNotification({
            show: true,
            type: "success",
            heading: "Tilføjet",
            subtext: `${name} er tilføjet til din ønskeliste`,
          });
        }
        setIsLiked(!isLiked);
      } catch (error) {
        console.error("Error liking/unliking product:", error);
        setNotification({
          show: true,
          type: "error",
          heading: "Fejl",
          subtext: "Der skete en fejl. Prøv venligst igen.",
        });
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent, sizeId: number, sizeName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Find a valid color for this product from product_quantity
    const variant = product.product_quantity?.find(pq => pq.sizeId === sizeId);
    const colorId = variant?.colorId || (product.product_quantity?.[0]?.colorId) || 1;

    addToCart({
        ...product,
        selectedSizeId: sizeId,
        selectedSize: sizeName,
        selectedColorId: colorId,
        quantity: 1
    });
    
    setNotification({
        show: true,
        type: "success",
        heading: "Lagt i kurv",
        subtext: `${name} (${sizeName}) er lagt i din kurv`,
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
    <>
      <Notification
        show={notification.show}
        type={notification.type}
        heading={notification.heading}
        subtext={notification.subtext}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <animated.div style={{ ...style, ...animation }}>
        <div
          className={`block overflow-hidden w-full group relative ${className}`}
        >
          <Link to={`/product/${id}`} className="block relative w-full aspect-square overflow-hidden">
            <img
              src={imageUrl || "https://placehold.co/450x450?text=Nordwear"}
              alt={name}
              className="block h-full w-full object-cover opacity-100"
            />

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div className="absolute top-2 left-2 bg-[#171717] font-['EB_Garamond'] text-[#F1F0EE] text-xs px-2 py-1 rounded-sm z-10">
                SPAR {discountPercent}%
              </div>
            )}

            {/* Like Button - Visible on mobile, hover-only on desktop */}
            <button
              onClick={handleLikeClick}
              className="absolute top-2 right-2 h-8 w-8 bg-[#171717] rounded-full flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"
            >
              {isLiked ? (
                <HeartIconSolid className="h-5 w-5 text-white" />
              ) : (
                <HeartIconOutline className="h-5 w-5" />
              )}
            </button>

            {/* Quick Add Container - Hidden on mobile */}
            <div className="absolute bottom-0 left-0 right-0 h-auto max-h-[150px] bg-white/40 backdrop-blur-2xl border-t border-white/20 hidden md:flex flex-col justify-center items-center translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out py-3 px-2 z-20">
                <span className="text-xs font-semibold uppercase tracking-wider mb-2 text-[#1c1c1c]">Tilføj produkt</span>
                <div className="flex gap-2 overflow-x-auto w-full justify-center scrollbar-hide pb-1">
                    {sortedSizes && sortedSizes.length > 0 ? (
                        sortedSizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={(e) => handleAddToCart(e, size.id, size.name)}
                                className="min-w-[24px] h-6 flex items-center justify-center border border-[#1c1c1c] text-[10px] font-medium text-[#1c1c1c] hover:bg-[#1c1c1c] hover:text-white transition-colors rounded-sm px-1"
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

          <div className="relative pt-3 text-center">
            <Link to={`/product/${id}`}>
                <h3 className="text-[14px] md:text-[1rem] text-[#1c1c1c] truncate">{name}</h3>
            </Link>

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
        </div>
      </animated.div>
    </>
  );
};

export default ProductCard;