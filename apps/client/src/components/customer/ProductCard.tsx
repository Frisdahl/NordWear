import React from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  category?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, category }) => {
  return (
    <div className="product-card" key={id}>
      <h2>{name}</h2>
      <p>Price: ${price.toFixed(2)}</p>
      {category && <p>Category: {category}</p>}
      <button>Add to Cart</button>
    </div>
  );
};

export default ProductCard;