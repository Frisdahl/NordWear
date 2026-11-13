import React from "react";

interface CategoryCardProps {
  name: string;
  imageUrl: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, imageUrl }) => {
  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden aspect-[4/5] bg-[#e9e7e3]">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="mt-4 inline-block">
        <div className="flex items-center gap-2">
          <h3 className="font-garamond text-xl md:text-2xl">{name}</h3>
          <span className="text-xl font-medium transition-transform duration-500 group-hover:translate-x-1">→</span>
        </div>
        <div className="w-full h-[1px] bg-black origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover:scale-x-100"></div>
      </div>
    </div>
  );
};

export default CategoryCard;
