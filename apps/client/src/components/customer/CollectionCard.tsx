import React from "react";
import { Link } from "react-router-dom";

interface CollectionCardProps {
  name: string;
  imageUrl: string;
  to: string;
}

/** A collection tile: a portrait image with the name left-aligned underneath. */
const CollectionCard: React.FC<CollectionCardProps> = ({ name, imageUrl, to }) => {
  return (
    <Link to={to} className="group block w-full">
      <div className="aspect-[4/5] w-full overflow-hidden bg-[#e9e7e3]">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <p className="mt-2 text-left font-garamond text-xl md:text-2xl">{name}</p>
    </Link>
  );
};

export default CollectionCard;
