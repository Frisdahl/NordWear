import React from "react";

interface CategoryCardProps {
  name: string;
  imageUrl: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, imageUrl }) => {
  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden aspect-video">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="mt-4 inline-block">
        <div className="flex items-center gap-2">
          <h2 className="font-['EB_Garamond'] text-2xl">{name}</h2>
          <span className="text-2xl font-medium">→</span>
        </div>
        <div className="w-full h-[1px] bg-black origin-left scale-x-0 transition-transform duration-500 ease-in-out group-hover:scale-x-100"></div>
      </div>
    </div>
  );
};

export default CategoryCard;
