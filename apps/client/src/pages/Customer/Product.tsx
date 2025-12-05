import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Product as ProductType } from "../../types";
import { fetchProduct } from "../../services/api";
import {
  StarIcon,
  CheckIcon,
  TruckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";
import Accordion from "../../components/Accordion";

// Mock Rating
const rating = { value: 4.7, count: 128 };

// Mock Key Sales Points
const salesPoints = [
  "Fri fragt ved køb over 499,-",
  "Levering indenfor 1-3 hverdage",
  "Forlænget 30-dages returret",
];

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for selections
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const getProduct = async () => {
      try {
        const fetchedProduct = await fetchProduct(Number(id));
        setProduct(fetchedProduct);
        // Set initial selected image and color
        if (fetchedProduct?.images?.length > 0) {
          setSelectedImage(fetchedProduct.images[0].url);
        }
        if (fetchedProduct?.product_quantity?.length > 0) {
          // This logic assumes we can derive colors from product_quantity
          // A better approach would be for the API to provide a clean color list
        }
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  // Memoize derived lists of unique colors and sizes
  const availableColors = useMemo(() => {
    if (!product || !product.product_quantity) return [];
    const colorMap = new Map();
    product.product_quantity.forEach((pq) => {
      // @ts-ignore - color relation is not in type, but is fetched
      if (pq.color) colorMap.set(pq.color.id, pq.color.name);
    });
    return Array.from(colorMap.values());
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product || !product.product_quantity) return [];
    const sizeMap = new Map();
    product.product_quantity.forEach((pq) => {
      // @ts-ignore - size relation is not in type, but is fetched
      if (pq.size) sizeMap.set(pq.size.id, pq.size.name);
    });
    return Array.from(sizeMap.values());
  }, [product]);

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableColors, availableSizes, selectedColor, selectedSize]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  const { name, price, offer_price, images } = product;

  return (
    <div className="bg-white">
      {/* Main Image */}
      <div className="w-full aspect-square bg-gray-200">
        <img
          src={selectedImage || "https://placehold.co/414x414"}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Image Gallery Thumbnails */}
      <div className="px-4">
        <div className="flex space-x-2 py-4 overflow-x-auto">
          {images &&
            images.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.url)}
                className={`h-[55px] w-[55px] flex-shrink-0 border-2 rounded-md ${
                  selectedImage === image.url
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image.url}
                  alt="thumbnail"
                  className="h-full w-full object-cover rounded-md"
                />
              </button>
            ))}
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Product Info */}
        <h1 className="text-2xl font-bold text-gray-800 font-['EB_Garamond']">
          {name}
        </h1>
        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(rating.value)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="ml-2 text-sm font-medium text-gray-600">
            {rating.value.toFixed(1)} ({rating.count} anmeldelser)
          </p>
        </div>

        {/* Key Sales Points */}
        <ul className="mt-4 space-y-2 text-sm text-gray-600">
          {salesPoints.map((point) => (
            <li key={point} className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="mt-6">
          <p className="font-['EB_Garamond']">
            {offer_price ? (
              <span className="flex items-baseline gap-3">
                <span className="text-[1.3125rem] font-bold text-[rgb(48,122,7)]">
                  kr. {offer_price.toFixed(2)}
                </span>
                <span className="line-through text-lg text-[#1c1c1ca6]">
                  kr. {price.toFixed(2)}
                </span>
              </span>
            ) : (
              <span className="text-[1.3125rem] font-bold text-gray-900">
                kr. {price.toFixed(2)}
              </span>
            )}
          </p>
        </div>

        {/* Color Swatches */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Farve</h3>
          <div className="flex items-center space-x-2 mt-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-8 w-8 rounded-full border-2 p-0.5 ${
                  selectedColor === color
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <div
                  className="h-full w-full rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                ></div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Dropdown */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Størrelse</h3>
          <select
            value={selectedSize || ""}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {availableSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-8">
          <button className="w-full bg-[#282828] text-white py-3 rounded-md text-lg font-medium hover:bg-opacity-90">
            Føj til indkøbskurv
          </button>
        </div>

        {/* Accordions */}
        <div className="mt-8">
          <Accordion
            icon={<TruckIcon className="h-6 w-6 text-gray-700" />}
            title="Gratis fragt | Gratis ombytning"
            content="Altid gratis fragt til Bring Pakkeshop."
          />
          <Accordion
            icon={<ShieldCheckIcon className="h-6 w-6 text-gray-700" />}
            title="Fremragende | Trustpilot"
            content="Læs alle vores +500 anmeldelser på Trustpilot"
          />
        </div>
      </div>
    </div>
  );
};
