import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getLikedProducts,
  getCustomerByUserId,
  unlikeProduct,
} from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Product } from "../../types";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatPrice } from "../../utils/formatPrice";

const CustomerFavorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchFavorites = async () => {
    if (user) {
      try {
        const customer = await getCustomerByUserId(user.id);
        const likedProducts = await getLikedProducts(customer.id);
        setFavorites(likedProducts.map((lp: any) => lp.product));
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (productId: number) => {
    if (user) {
      try {
        const customer = await getCustomerByUserId(user.id);
        await unlikeProduct(customer.id, productId);
        fetchFavorites();
      } catch (error) {
        console.error("Failed to remove favorite:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-6 ">
      <h1 className="text-2xl font-bold mb-8">Favoritter</h1>
      <div className="bg-white p-8 rounded-lg ">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : favorites.length > 0 ? (
          <div>
            {favorites.map((product, index) => (
              <div key={product.id}>
                <div className="flex items-center space-x-8">
                  <img
                    src={product.imageUrl || ""}
                    alt={product.name}
                    className="w-40 h-40 object-cover"
                  />
                  <div className="flex-grow flex flex-col gap-2">
                    <h2 className="font-semibold text-xl">{product.name}</h2>
                    <p className="text-md text-gray-500">
                      <span className="font-semibold">{"Kategori: "}</span>
                      {product.category?.name}
                    </p>
                    <p className="text-md">
                      {product.offer_price ? (
                        <span className="flex items-center space-x-2">
                          <span>{formatPrice(product.offer_price)}</span>
                          <span className="line-through text-gray-400">{formatPrice(product.price)}</span>
                        </span>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </p>
                  </div>
                  <button onClick={() => handleRemoveFavorite(product.id || 0)}>
                    <TrashIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                {index < favorites.length - 1 && <hr className="my-10" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Du har ingen favoritter endnu
            </h2>
            <p>Gå til buttikken for at tilføje favoritter.</p>
            <Link
              to="/"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Gå til butikken
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerFavorites;
