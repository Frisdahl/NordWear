import React from "react";

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="block overflow-hidden w-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-square bg-gray-200">
      </div>

      {/* Text Skeleton */}
      <div className="relative pt-3 text-center">
        {/* Name Skeleton */}
        <div className="h-4 bg-gray-200 w-3/4 mx-auto mb-2"></div>

        {/* Price Skeleton */}
        <div className="mt-1.5 flex items-center justify-center">
          <div className="h-4 bg-gray-200 w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
